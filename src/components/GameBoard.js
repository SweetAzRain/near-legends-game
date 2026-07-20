// ===== Игровое поле =====

import { createCardElement, createHeroElement, createManaCrystals, createHealthBar } from './CardComponent.js';

export class GameBoard {
  constructor(gameEngine, container) {
    this.engine = gameEngine;
    this.container = container;
    this.selectedCard = null;
    this.selectedFieldCreature = null;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const board = document.createElement('div');
    board.className = 'game-board';

    // === Зона врага (сверху) ===
    const enemyZone = this.createPlayerZone(1, true);
    board.appendChild(enemyZone);

    // === Поле боя ===
    const battlefield = document.createElement('div');
    battlefield.className = 'battlefield';

    // Вражеский ряд
    const enemyRow = document.createElement('div');
    enemyRow.className = 'battlefield-row enemy';
    this.engine.players[1].field.forEach(creature => {
      const cardEl = createCardElement(creature, { inField: true });
      cardEl.addEventListener('click', () => this.onEnemyCreatureClick(creature));
      enemyRow.appendChild(cardEl);
    });
    battlefield.appendChild(enemyRow);

    // Шарды (если есть)
    if (this.engine.shards.length > 0) {
      const shardDiv = document.createElement('div');
      shardDiv.className = 'shard-divider';
      battlefield.appendChild(shardDiv);
    }

    // Дружеский ряд
    const playerRow = document.createElement('div');
    playerRow.className = 'battlefield-row';
    this.engine.players[0].field.forEach(creature => {
      const cardEl = createCardElement(creature, { inField: true });
      if (creature.canAttack && !creature.frozen) {
        cardEl.classList.add('playable');
      }
      cardEl.addEventListener('click', () => this.onFriendlyCreatureClick(creature));
      playerRow.appendChild(cardEl);
    });
    battlefield.appendChild(playerRow);

    board.appendChild(battlefield);

    // === Зона игрока (снизу) ===
    const playerZone = this.createPlayerZone(0, false);
    board.appendChild(playerZone);

    // === Рука ===
    const handZone = document.createElement('div');
    handZone.className = 'hand-zone';

    const currentPlayer = this.engine.players[this.engine.currentPlayer];
    const isPlayerTurn = this.engine.currentPlayer === 0;

    currentPlayer.hand.forEach(card => {
      const playable = isPlayerTurn && this.canPlayCard(currentPlayer, card);
      const cardEl = createCardElement(card, { inHand: true, playable });

      if (isPlayerTurn) {
        cardEl.addEventListener('click', () => this.onHandCardClick(card, cardEl));
      }

      handZone.appendChild(cardEl);
    });

    board.appendChild(handZone);

    // === Кнопка конца хода ===
    if (isPlayerTurn) {
      const endTurnBtn = document.createElement('button');
      endTurnBtn.className = 'btn btn-primary end-turn-btn';
      endTurnBtn.textContent = 'Закончить ход →';
      endTurnBtn.addEventListener('click', () => this.onEndTurn());
      board.appendChild(endTurnBtn);
    }

    // === Лог боя ===
    const log = document.createElement('div');
    log.className = 'battle-log';
    this.engine.battleLog.slice(-10).forEach(entry => {
      const entryEl = document.createElement('div');
      entryEl.className = 'battle-log-entry';
      entryEl.textContent = `[${entry.turn}] ${entry.message}`;
      log.appendChild(entryEl);
    });
    board.appendChild(log);

    // === Таймер хода ===
    const timer = document.createElement('div');
    timer.className = 'turn-timer';
    timer.textContent = `Ход ${this.engine.turn} • ${currentPlayer.hero.name}`;
    board.appendChild(timer);

    this.container.appendChild(board);
  }

  createPlayerZone(playerIndex, isEnemy) {
    const player = this.engine.players[playerIndex];
    const zone = document.createElement('div');
    zone.className = 'hero-zone';

    // Герой
    const heroSection = document.createElement('div');
    heroSection.style.display = 'flex';
    heroSection.style.alignItems = 'center';
    heroSection.style.gap = '15px';

    const heroAvatar = createHeroElement(player.hero, player);
    heroSection.appendChild(heroAvatar);

    const heroInfo = document.createElement('div');
    heroInfo.innerHTML = `
      <div style="font-weight:bold;font-size:16px;">${player.hero.name}</div>
      <div style="font-size:12px;color:#94a3b8;">${player.faction}</div>
    `;
    heroSection.appendChild(heroInfo);

    zone.appendChild(heroSection);

    // Статистика
    const stats = document.createElement('div');
    stats.className = 'hero-stats';

    // Здоровье
    const healthBar = createHealthBar(player.hero.currentHealth, player.hero.maxHealth);
    const healthText = document.createElement('span');
    healthText.textContent = `${player.hero.currentHealth}/${player.hero.maxHealth}`;
    healthText.style.fontSize = '14px';
    healthText.style.fontWeight = 'bold';

    stats.appendChild(healthText);
    stats.appendChild(healthBar);

    // Мана (только для текущего игрока или если видно)
    if (!isEnemy || this.engine.confidentialMode.active) {
      const manaCrystals = createManaCrystals(player.hero.mana, player.hero.maxMana);
      stats.appendChild(manaCrystals);
    }

    // Токены HOT
    if (player.tokens.HOT > 0) {
      const tokenBadge = document.createElement('span');
      tokenBadge.style.cssText = 'background:#f97316;padding:2px 8px;border-radius:12px;font-size:12px;';
      tokenBadge.textContent = `🔥 ${player.tokens.HOT}`;
      stats.appendChild(tokenBadge);
    }

    zone.appendChild(stats);

    // Артефакты
    if (player.artifacts.length > 0) {
      const artifactsRow = document.createElement('div');
      artifactsRow.style.display = 'flex';
      artifactsRow.style.gap = '5px';
      player.artifacts.forEach(art => {
        const badge = document.createElement('span');
        badge.style.cssText = 'background:#334155;padding:2px 6px;border-radius:4px;font-size:10px;';
        badge.textContent = art.art || '🔮';
        artifactsRow.appendChild(badge);
      });
      zone.appendChild(artifactsRow);
    }

    return zone;
  }

  canPlayCard(player, card) {
    let cost = card.cost;

    // Скидки
    if (card.keywords?.includes('ux')) {
      const wallet = player.artifacts.find(a => a.name === 'Intear Wallet');
      if (wallet) cost -= 1;
    }

    if (player.hero.name === 'Slime' && card.type === 'spell') {
      cost -= 1;
    }

    if (card.type === 'creature' && player.artifacts.some(a => a.name === 'Legion Banner')) {
      cost -= 1;
    }

    cost = Math.max(0, cost);

    // Альтернативная стоимость
    if (card.altCost && player.tokens[card.altCost.token] >= card.altCost.amount) {
      return true;
    }

    return player.hero.mana >= cost;
  }

onHandCardClick(card, element) {
    if (this.selectedCard === card) {
        this.selectedCard = null;
        element.classList.remove('selected');
        return;
    }

    // Сброс предыдущего выбора
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));

    const needsTarget = card.type === 'spell' && card.onPlay &&
        (card.onPlay.type === 'damage' || card.onPlay.type === 'freeze');

    this.selectedCard = card;

    // Существа, артефакты и заклинания без цели разыгрываются сразу
    if (!needsTarget) {
        this.playSelectedCard(null);
        return;
    }

    // Заклинания урона/заморозки требуют клика по цели
    element.classList.add('selected');
    this.highlightValidTargets(card);
}

  onFriendlyCreatureClick(creature) {
    if (this.selectedFieldCreature === creature) {
      this.selectedFieldCreature = null;
      return;
    }

    // Если есть выбранная карта в руке — разыграть
    if (this.selectedCard) {
      this.playSelectedCard(creature);
      return;
    }

    // Если выбрано существо для атаки
    if (creature.canAttack && !creature.frozen && this.engine.currentPlayer === 0) {
      this.selectedFieldCreature = creature;
      this.highlightAttackTargets();
    }
  }

  onEnemyCreatureClick(creature) {
    // Если есть выбранное сущест��о для атаки — атаковать
    if (this.selectedFieldCreature) {
      this.attackCreature(this.selectedFieldCreature, creature);
      this.selectedFieldCreature = null;
      return;
    }

    // Если есть выбранная карта — разыграть на цель
    if (this.selectedCard) {
      this.playSelectedCard(creature);
    }
  }

  highlightValidTargets(card) {
    // Подсветка вражеских существ
    document.querySelectorAll('.battlefield-row.enemy .card').forEach(el => {
      el.style.boxShadow = '0 0 10px #ef4444';
    });
  }

  highlightAttackTargets() {
    // Подсветка атакуемых целей
    document.querySelectorAll('.battlefield-row.enemy .card').forEach(el => {
      el.style.boxShadow = '0 0 10px #f59e0b';
    });
  }

  playSelectedCard(target = null) {
    if (!this.selectedCard) return;

    // ИСПРАВЛЕНО: валидация instanceId
    if (!this.selectedCard.instanceId) {
      console.error('Card has no instanceId:', this.selectedCard);
      return;
    }

    const success = this.engine.playCard(0, this.selectedCard.instanceId, target);

    if (success) {
      this.selectedCard = null;
      this.render();

      // Проверка окончания игры
      if (this.engine.gameOver) {
        this.showGameOver();
      }
    }
  }

  attackCreature(attacker, defender) {
    const success = this.engine.attackWithCreature(this.engine.players[0], attacker, defender);
    if (success) {
      this.render();
      if (this.engine.gameOver) this.showGameOver();
    }
  }

  onEndTurn() {
    this.selectedCard = null;
    this.selectedFieldCreature = null;
    this.engine.endTurn();
    this.render();

    // Если ход ИИ — запускаем
    if (this.engine.currentPlayer === 1 && !this.engine.gameOver) {
      setTimeout(() => this.playAI(), 1000);
    }
  }

  playAI() {
    const ai = this.engine.players[1];

    // Простой ИИ: разыгрывает самую дорогую playable карту
    const playableCards = ai.hand.filter(c => {
      let cost = c.cost;
      if (ai.hero.mana >= cost) return true;
      if (c.altCost && ai.tokens[c.altCost.token] >= c.altCost.amount) return true;
      return false;
    }).sort((a, b) => b.cost - a.cost);

    if (playableCards.length > 0) {
      const card = playableCards[0];
      this.engine.playCard(1, card.instanceId);
      this.render();

      setTimeout(() => this.playAI(), 800);
      return;
    }

    // Атака всеми существами
    ai.field.forEach(creature => {
      if (creature.canAttack && !creature.frozen) {
        const enemyField = this.engine.players[0].field;
        const target = enemyField.length > 0 ? enemyField[0] : null;
        this.engine.attackWithCreature(ai, creature, target);
      }
    });

    this.render();

    if (!this.engine.gameOver) {
      setTimeout(() => {
        this.engine.endTurn();
        this.render();
      }, 1000);
    }
  }

  showGameOver() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h2 class="modal-title">${this.engine.winner === 0 ? '🎉 Победа!' : '💀 Поражение'}</h2>
        <p style="text-align:center;color:#94a3b8;margin-bottom:20px;">
          ${this.engine.players[this.engine.winner].hero.name} одержал победу!
        </p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button class="btn btn-primary" onclick="location.reload()">🔄 Новая игра</button>
          <button class="btn" id="btn-menu">🏠 В меню</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // ИСПРАВЛЕНО: использование addEventListener вместо onclick
    const menuBtn = modal.querySelector('#btn-menu');
    if (menuBtn && window.showTitleScreen) {
      menuBtn.addEventListener('click', () => {
        modal.remove();
        window.showTitleScreen();
      });
    }
  }
}

export default GameBoard;
