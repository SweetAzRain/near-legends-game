// ===== NEAR LEGENDS — Игровой движок =====

import { getCardById, FACTIONS } from '../cards/cardData.js';

export class GameEngine {
  constructor(player1Deck, player2Deck) {
    this.players = [
      this.createPlayer(player1Deck, 0),
      this.createPlayer(player2Deck, 1)
    ];
    this.currentPlayer = 0;
    this.turn = 1;
    this.phase = 'start'; // start, main, combat, end
    this.shards = []; // { id, duration, zones: [[], []] }
    this.governance = null; // { rule, duration, caster }
    this.confidentialMode = { active: false, duration: 0, player: null };
    this.battleLog = [];
    this.gameOver = false;
    this.winner = null;
    this.darkPool = false;
  }

  createPlayer(deck, index) {
    const hero = deck.cards.find(c => c.type === 'hero');
    const otherCards = deck.cards.filter(c => c.type !== 'hero').sort(() => Math.random() - 0.5);

    return {
      index,
      faction: deck.faction,
      hero: { ...hero, currentHealth: hero.health, maxHealth: hero.health, mana: 0, maxMana: 0 },
      deck: otherCards,
      hand: [],
      field: [],
      artifacts: [],
      offChain: [], // для Intents
      tokens: { HOT: 0 },
      frozen: [], // для Stake
      stats: { cardsPlayed: 0, damageDealt: 0, creaturesSummoned: 0 }
    };
  }

  // ===== Начало игры =====
  startGame() {
    this.players.forEach(p => {
      this.drawCards(p, 3); // Стартовая рука
    });
    this.players[1].hand.push(...this.players[1].deck.splice(0, 1)); // The Coin
    this.startTurn(0);
  }

  // ===== Ход =====
  startTurn(playerIndex) {
    this.currentPlayer = playerIndex;
    const player = this.players[playerIndex];
    const enemy = this.players[1 - playerIndex];

    this.phase = 'start';

    // Увеличение маны
    player.hero.maxMana = Math.min(10, player.hero.maxMana + 1);
    player.hero.mana = player.hero.maxMana;

    // Дополнительная мана от героя Stake
    if (player.hero.name === 'Alexander Skidanov') {
      player.hero.mana += player.field.length;
    }

    // Дополнительная мана от Treasury
    const treasury = player.artifacts.find(a => a.name === 'Treasury');
    if (treasury) {
      player.hero.maxMana += 2;
      player.hero.mana += 2;
    }

    // Возьмите карту
    this.drawCards(player, 1);

    // Разморозка (Stake)
    this.processUnfreeze(player);

    // Пассивные эффекты в начале хода
    this.processTurnStartEffects(player);
    this.processTurnStartEffects(enemy);

    // Обновление шардов
    this.updateShards();

    // Обновление governance
    if (this.governance) {
      this.governance.duration--;
      if (this.governance.duration <= 0) this.governance = null;
    }

    // Обновление confidential mode
    if (this.confidentialMode.active) {
      this.confidentialMode.duration--;
      if (this.confidentialMode.duration <= 0) {
        this.confidentialMode.active = false;
        this.confidentialMode.player = null;
      }
    }

    // Dark Pool (IronClaw)
    if (this.darkPool) {
      this.autoPlayTopCard(player);
      this.autoPlayTopCard(enemy);
    }

    this.phase = 'main';
    this.log(`Ход ${this.turn}: ${player.hero.name}`);
  }

  drawCards(player, amount) {
    for (let i = 0; i < amount; i++) {
      if (player.deck.length > 0) {
        const card = player.deck.pop();
        player.hand.push({ ...card, instanceId: `${card.id}_${Date.now()}_${i}` });
      } else {
        // Fatigue
        player.hero.currentHealth -= 1;
        this.log(`${player.hero.name} получает усталость: -1 здоровья`);
      }
    }
  }

  // ===== Разыгрывание карты =====
  playCard(playerIndex, cardInstanceId, target = null) {
    const player = this.players[playerIndex];
    const cardIndex = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIndex === -1) return false;

    const card = player.hand[cardIndex];

    // Проверка маны
    let cost = card.cost;

    // Скидки Intear
    if (card.keywords.includes('ux')) {
      const uxDiscount = this.countUXDiscounts(player);
      cost = Math.max(0, cost - uxDiscount);
    }

    // Скидка от Slime
    if (player.hero.name === 'Slime' && card.type === 'spell') {
      cost = Math.max(0, cost - 1);
    }

    // Скидка от Legion Banner
    if (card.type === 'creature' && player.artifacts.some(a => a.name === 'Legion Banner')) {
      cost = Math.max(0, cost - 1);
    }

    // Проверка governance
    if (this.governance?.rule.allCardsCost) {
      cost += this.governance.rule.allCardsCost;
    }

    if (player.hero.mana < cost) return false;

    // Альтернативная стоимость (HOT Token)
    let usedToken = false;
    if (card.altCost && player.tokens.HOT >= card.altCost.amount) {
      player.tokens.HOT -= card.altCost.amount;
      usedToken = true;
    } else {
      player.hero.mana -= cost;
    }

    // Удаление из руки
    player.hand.splice(cardIndex, 1);

    // Выполнение эффекта
    this.executeCardEffect(player, card, target);

    // Статистика
    player.stats.cardsPlayed++;

    // Триггеры
    this.triggerOnPlayEffects(player, card);

    return true;
  }

  executeCardEffect(player, card, target) {
    const enemy = this.players[1 - player.index];

    switch (card.type) {
      case 'creature':
        this.summonCreature(player, card);
        break;
      case 'spell':
        this.castSpell(player, enemy, card, target);
        break;
      case 'artifact':
        this.placeArtifact(player, card);
        break;
      case 'hero':
        this.activateHeroAbility(player, card);
        break;
    }
  }

  summonCreature(player, card) {
    const creature = {
      ...card,
      currentHealth: card.health,
      maxHealth: card.health,
      canAttack: card.keywords.includes('charge'),
      hasAttacked: false,
      divineShield: false,
      stealth: card.keywords.includes('stealth'),
      taunt: card.keywords.includes('taunt'),
      frozen: false,
      tee: card.keywords.includes('tee_protection'),
      buffs: []
    };

    // Проверка на шарды (Nightshade)
    if (this.shards.length > 0) {
      const shard = this.shards[0];
      shard.zones[player.index].push(creature);
    } else {
      player.field.push(creature);
    }

    player.stats.creaturesSummoned++;
    this.log(`${player.hero.name} призывает ${card.name} (${card.attack}/${card.health})`);

    // Боевой клич
    if (card.onPlay) {
      this.processOnPlayEffect(player, creature, card.onPlay);
    }
  }

  castSpell(player, enemy, card, target) {
    this.log(`${player.hero.name} разыгрывает ${card.name}`);

    if (!card.onPlay) return;

    const effect = card.onPlay;

    // Обработка различных типов заклинаний
    if (effect.type === 'damage') {
      const targetCreature = this.findTarget(target);
      if (targetCreature) {
        this.dealDamage(targetCreature, effect.amount || effect.damage);
        if (effect.killBonus && targetCreature.currentHealth <= 0) {
          if (effect.killBonus.draw) this.drawCards(player, effect.killBonus.draw);
          if (effect.killBonus.mana) player.hero.mana += effect.killBonus.mana;
        }
      }
    }

    if (effect.type === 'aoe_damage') {
      enemy.field.forEach(c => this.dealDamage(c, effect.damage));
      if (effect.reward && enemy.field.filter(c => c.currentHealth <= 0).length >= (effect.threshold || 0)) {
        this.summonCreature(player, { 
          name: effect.reward.card, 
          attack: effect.reward.attack, 
          health: effect.reward.health,
          type: 'creature',
          faction: player.faction,
          art: '🐛'
        });
      }
    }

    if (effect.type === 'buff_all') {
      player.field.forEach(c => {
        c.attack += effect.attack || 0;
        c.currentHealth += effect.health || 0;
        c.maxHealth += effect.health || 0;
        if (effect.charge) c.canAttack = true;
      });
    }

    if (effect.type === 'draw') {
      this.drawCards(player, effect.amount);
    }

    if (effect.type === 'freeze') {
      const targetCreature = this.findTarget(target);
      if (targetCreature) {
        targetCreature.frozen = true;
        targetCreature.canAttack = false;
        player.frozen.push({ creature: targetCreature, turns: effect.duration, manaReward: effect.manaReward });
      }
    }

    if (effect.type === 'heal') {
      player.hero.currentHealth = Math.min(player.hero.maxHealth, player.hero.currentHealth + effect.amount);
    }

    if (effect.type === 'generate_token') {
      player.tokens[effect.token] = (player.tokens[effect.token] || 0) + effect.amount;
      this.log(`${player.hero.name} получает ${effect.amount} ${effect.token} Token`);
    }

    if (effect.type === 'confidential_mode') {
      this.confidentialMode = { active: true, duration: effect.duration, player: player.index };
      this.log('Активирован Confidential Mode!');
    }

    if (effect.type === 'create_shards') {
      this.shards.push({
        id: Date.now(),
        duration: effect.duration,
        zones: [[], []]
      });
      this.log(`Создано ${effect.count} шард(а) на ${effect.duration} хода!`);
    }

    if (effect.type === 'governance') {
      // Случайное правило для простоты
      const rules = effect.options;
      const rule = rules[Math.floor(Math.random() * rules.length)];
      this.governance = { rule, duration: effect.duration, caster: player.index };
      this.log(`Активировано правило: ${rule.name}`);
    }

    if (effect.type === 'choose' && effect.options) {
      // Для UI — вернуть опции, игрок выбирает
      return { requiresChoice: true, options: effect.options };
    }

    // Перегрузка
    if (effect.overload) {
      player.hero.overload = true;
    }
  }

  placeArtifact(player, card) {
    const artifact = { ...card, currentHealth: card.health || 5, maxHealth: card.health || 5 };
    player.artifacts.push(artifact);
    this.log(`${player.hero.name} размещает артефакт ${card.name}`);

    // Триггер от Pasha
    if (player.hero.name === 'Pasha') {
      player.field.forEach(c => {
        c.currentHealth = Math.min(c.maxHealth, c.currentHealth + 2);
      });
      this.log('Pasha лечит всех существ на 2');
    }
  }

  activateHeroAbility(player, card) {
    if (player.hero.mana < card.active.cost) return;
    player.hero.mana -= card.active.cost;

    const effect = card.active;
    const enemy = this.players[1 - player.index];

    if (effect.type === 'buff_all') {
      player.field.forEach(c => {
        c.attack += effect.attack;
        c.currentHealth += effect.health;
        c.maxHealth += effect.health;
        if (effect.cleave) c.cleave = true;
      });
    }

    if (effect.type === 'mass_attack') {
      player.field.forEach(c => {
        if (c.canAttack && !c.frozen) {
          this.attackWithCreature(player, c, null, true);
        }
      });
    }

    this.log(`${player.hero.name} активирует способность!`);
  }

  // ===== Бой =====
  attackWithCreature(player, creature, target, isHeroAbility = false) {
    if (!creature.canAttack || creature.frozen || creature.hasAttacked) return false;

    const enemy = this.players[1 - player.index];

    // Проверка Taunt
    const enemyTaunts = enemy.field.filter(c => c.taunt && c.currentHealth > 0);
    if (enemyTaunts.length > 0 && target && !target.taunt) {
      return false; // Должны атаковать Taunt
    }

    let targetCreature = target;
    if (!targetCreature && enemy.field.length > 0) {
      // Если есть Taunt — атакуем его
      if (enemyTaunts.length > 0) {
        targetCreature = enemyTaunts[0];
      } else {
        // Иначе атакуем случайное или героя
        targetCreature = enemy.field[Math.floor(Math.random() * enemy.field.length)];
      }
    }

    if (targetCreature) {
      // Атака существа
      this.dealDamage(targetCreature, creature.attack);

      // Контратака
      if (targetCreature.currentHealth > 0 && !creature.stealth) {
        this.dealDamage(creature, targetCreature.attack);
      }

      creature.hasAttacked = true;
      creature.canAttack = false;

      // Триггер Berserker
      if (creature.name === 'Berserker') {
        const legionCount = player.field.filter(c => c.faction === 'legion').length;
        if (legionCount >= 3) {
          this.dealDamage(targetCreature, creature.attack); // Двойной урон
        }
      }
    } else {
      // Атака героя
      this.dealDamageToHero(enemy, creature.attack);
      creature.hasAttacked = true;
      creature.canAttack = false;
    }

    // Снятие Stealth после атаки
    if (creature.stealth) creature.stealth = false;

    return true;
  }

  dealDamage(target, amount) {
    if (target.divineShield) {
      target.divineShield = false;
      this.log('Снят Divine Shield!');
      return;
    }

    target.currentHealth -= amount;

    if (target.currentHealth <= 0) {
      this.destroyCreature(target);
    }
  }

  dealDamageToHero(player, amount) {
    // Проверка TEE-защиты
    if (player.artifacts.some(a => a.name === 'TEE Enclave') && Math.random() > 0.5) {
      this.log('TEE-защита блокировала урон по герою!');
      return;
    }

    player.hero.currentHealth -= amount;
    player.stats.damageDealt += amount;

    if (player.hero.currentHealth <= 0) {
      this.gameOver = true;
      this.winner = 1 - player.index;
      this.log(`ИГРА ОКОНЧЕНА! Победитель: ${this.players[this.winner].hero.name}`);
    }
  }

  destroyCreature(creature) {
    const owner = this.players.find(p => p.field.includes(creature));
    if (!owner) return;

    const index = owner.field.indexOf(creature);
    if (index > -1) owner.field.splice(index, 1);

    // Триггер смерти
    if (creature.onDeath) {
      this.processOnDeathEffect(owner, creature, creature.onDeath);
    }

    this.log(`${creature.name} уничтожен!`);
  }

  // ===== Вспомогательные методы =====
  findTarget(targetId) {
    for (const player of this.players) {
      const found = player.field.find(c => c.instanceId === targetId);
      if (found) return found;
    }
    return null;
  }

  processTurnStartEffects(player) {
    // Пассивки артефактов
    player.artifacts.forEach(art => {
      if (art.onTurnStart) {
        // Упрощённая обработка
      }
    });

    // Пассивки существ
    player.field.forEach(c => {
      if (c.onTurnStart) {
        // Scaling buff (Validator Node)
        if (c.onTurnStart.type === 'scaling_buff') {
          c.turnsOnField = (c.turnsOnField || 0) + 1;
          if (c.turnsOnField % c.onTurnStart.every === 0) {
            c.attack += c.onTurnStart.attack;
            c.maxHealth += c.onTurnStart.health;
            c.currentHealth += c.onTurnStart.health;
          }
        }
      }
    });

    // Можно атаковать снова
    player.field.forEach(c => {
      if (!c.frozen) c.canAttack = true;
      c.hasAttacked = false;
    });
  }

  processUnfreeze(player) {
    player.frozen = player.frozen.filter(f => {
      f.turns--;
      if (f.turns <= 0) {
        f.creature.frozen = false;
        f.creature.canAttack = true;
        this.log(`${f.creature.name} разморожен!`);
        return false;
      }
      // Мана от стейкинга
      if (f.manaReward) {
        player.hero.mana += f.manaReward;
      }
      return true;
    });
  }

  updateShards() {
    this.shards = this.shards.filter(s => {
      s.duration--;
      if (s.duration <= 0) {
        // Возвращаем существ из шардов на поле
        s.zones.forEach((zone, idx) => {
          this.players[idx].field.push(...zone);
        });
        this.log('Шарды рассеялись!');
        return false;
      }
      return true;
    });
  }

  processOnPlayEffect(player, creature, effect) {
    // Synergy (Shard Worker)
    if (effect.type === 'synergy') {
      const sameName = player.field.filter(c => c.name === effect.target);
      if (sameName.length >= 2) {
        sameName.forEach(c => {
          c.attack += effect.buff.attack;
          c.maxHealth += effect.buff.health;
          c.currentHealth += effect.buff.health;
        });
      }
    }
  }

  processOnDeathEffect(player, creature, effect) {
    if (effect.type === 'draw') {
      this.drawCards(player, effect.amount);
    }
    if (effect.type === 'return_to_hand') {
      setTimeout(() => {
        const card = getCardById(creature.id);
        if (card) {
          player.hand.push({ ...card, instanceId: `${card.id}_return_${Date.now()}` });
          this.log(`${creature.name} возвращается в руку!`);
        }
      }, effect.delay * 1000); // Упрощённо
    }
  }

  triggerOnPlayEffects(player, card) {
    // Model Trainer
    if (card.type === 'spell') {
      player.field.filter(c => c.name === 'Model Trainer').forEach(c => {
        c.attack += 1;
        c.maxHealth += 1;
        c.currentHealth += 1;
        c.spellCount = (c.spellCount || 0) + 1;
        if (c.spellCount >= 5) {
          c.attack = 5;
          c.maxHealth = 5;
          c.currentHealth = 5;
          this.log('Model Trainer эволюционировал в Super Model!');
        }
      });
    }
  }

  countUXDiscounts(player) {
    let discount = 0;
    if (player.artifacts.some(a => a.name === 'Intear Wallet')) discount += 1;
    // UX Designer
    player.field.filter(c => c.name === 'UX Designer').forEach(() => discount += 1);
    return discount;
  }

  autoPlayTopCard(player) {
    if (player.deck.length > 0) {
      const card = player.deck.pop();
      this.executeCardEffect(player, card, null);
      this.log(`Dark Pool: ${player.hero.name} автоматически разыгрывает ${card.name}`);
    }
  }

  endTurn() {
    const player = this.players[this.currentPlayer];

    // Обработка перегрузки
    if (player.hero.overload) {
      player.hero.overload = false;
      this.log(`${player.hero.name} пропускает ход из-за перегрузки!`);
      this.turn++;
      this.startTurn(1 - this.currentPlayer);
      return;
    }

    // Конец хода эффекты
    this.processTurnEndEffects(player);

    this.turn++;
    this.startTurn(1 - this.currentPlayer);
  }

  processTurnEndEffects(player) {
    // HOT Miner
    player.field.filter(c => c.name === 'HOT Miner').forEach(() => {
      player.tokens.HOT = (player.tokens.HOT || 0) + 1;
    });

    // Chunk Producer
    player.field.filter(c => c.name === 'Chunk Producer').forEach(() => {
      const shardCreatures = player.field.filter(c => c !== undefined); // Упрощённо
      if (shardCreatures.length >= 2) {
        shardCreatures.forEach(c => {
          c.maxHealth += 1;
          c.currentHealth += 1;
        });
      }
    });
  }

  log(message) {
    this.battleLog.push({ turn: this.turn, message, time: Date.now() });
    console.log(`[Turn ${this.turn}] ${message}`);
  }

  // ===== Сериализация для сохранения =====
  serialize() {
    return JSON.stringify({
      players: this.players,
      currentPlayer: this.currentPlayer,
      turn: this.turn,
      phase: this.phase,
      shards: this.shards,
      governance: this.governance,
      confidentialMode: this.confidentialMode,
      battleLog: this.battleLog,
      gameOver: this.gameOver,
      winner: this.winner
    });
  }

  static deserialize(data) {
    const parsed = JSON.parse(data);
    const game = Object.create(GameEngine.prototype);
    Object.assign(game, parsed);
    return game;
  }
}

export default GameEngine;
