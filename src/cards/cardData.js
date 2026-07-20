// ===== NEAR LEGENDS — База данных карт =====

export const FACTIONS = {
  nightshade: { name: 'Nightshade', color: '#a855f7', icon: '🌙', hero: 'Illia Polosukhin' },
  ironclaw: { name: 'IronClaw', color: '#ef4444', icon: '🐾', hero: 'IronClaw' },
  intents: { name: 'Intents', color: '#06b6d4', icon: '🔗', hero: 'Elliott Braem' },
  stake: { name: 'House of Stake', color: '#f59e0b', icon: '🏛️', hero: 'Alexander Skidanov' },
  aurora: { name: 'Aurora', color: '#10b981', icon: '🌈', hero: 'Aurora' },
  hot: { name: 'HOT Protocol', color: '#f97316', icon: '🔥', hero: 'Petr Volnov' },
  intear: { name: 'Intear', color: '#ec4899', icon: '🦠', hero: 'Slime' },
  legion: { name: 'NEAR Legion', color: '#6366f1', icon: '🛡️', hero: 'Legion Commander' }
};

export const RARITIES = {
  legendary: { name: 'Легендарная', color: '#fbbf24' },
  epic: { name: 'Эпическая', color: '#a855f7' },
  rare: { name: 'Редкая', color: '#3b82f6' },
  common: { name: 'Обычная', color: '#94a3b8' }
};

export const CARD_TYPES = {
  hero: 'Герой',
  creature: 'Существо',
  spell: 'Заклинание',
  artifact: 'Артефакт'
};

// Полная база карт (96 штук)
export const ALL_CARDS = [
  // === NIGHTSHADE (12 карт) ===
  {
    id: 'ns_001', name: 'Illia Polosukhin', faction: 'nightshade', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 6, health: 8, maxHealth: 8,
    art: '👤', keywords: [],
    effect: 'Пассивка: Attention Mechanism — смотрите верхние 3 карты колоды в начале хода. Активная: все существа +3/+3 и атакуют всех врагов.',
    passive: { type: 'scry', amount: 3 },
    active: { cost: 10, type: 'buff_all', attack: 3, health: 3, cleave: true }
  },
  {
    id: 'ns_002', name: 'Shard Worker', faction: 'nightshade', type: 'creature',
    rarity: 'rare', cost: 2, attack: 2, health: 2, maxHealth: 2,
    art: '⚔️', keywords: [],
    effect: 'Parallel Processing — если на столе другой Shard Worker, оба получают +1/+1.',
    onPlay: { type: 'synergy', target: 'Shard Worker', buff: { attack: 1, health: 1 } }
  },
  {
    id: 'ns_003', name: 'Nightshade Split', faction: 'nightshade', type: 'spell',
    rarity: 'epic', cost: 4, attack: 0, health: 0,
    art: '✨', keywords: [],
    effect: 'Разделите доску на 2 шарда на 3 хода. Каждый шард имеет независимый лимит маны.',
    onPlay: { type: 'create_shards', duration: 3, count: 2 }
  },
  {
    id: 'ns_004', name: 'Parallel Execution', faction: 'nightshade', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '⚡', keywords: [],
    effect: 'Активируйте 2 карты из разных шардов одновременно.',
    onPlay: { type: 'parallel_play', count: 2 }
  },
  {
    id: 'ns_005', name: '1 Million TPS', faction: 'nightshade', type: 'spell',
    rarity: 'legendary', cost: 10, attack: 0, health: 0,
    art: '🎯', keywords: ['overload'],
    effect: 'Разыгрывает 5 случайных карт из колоды бесплатно. Перегрузка: пропустите ход.',
    onPlay: { type: 'random_play', count: 5, free: true, overload: true }
  },
  {
    id: 'ns_006', name: 'Shard Guardian', faction: 'nightshade', type: 'creature',
    rarity: 'rare', cost: 5, attack: 4, health: 5, maxHealth: 5,
    art: '🛡️', keywords: ['taunt'],
    effect: 'Taunt. Если есть шард — +2/+2 и Divine Shield.',
    onPlay: { type: 'conditional_buff', condition: 'shard_exists', attack: 2, health: 2, divineShield: true }
  },
  {
    id: 'ns_007', name: 'State Sync', faction: 'nightshade', type: 'spell',
    rarity: 'common', cost: 2, attack: 0, health: 0,
    art: '📊', keywords: [],
    effect: 'Скопируйте эффект последней карты в шарде. Если шардов нет — возьмите 2 карты.',
    onPlay: { type: 'copy_last_effect', fallback: 'draw', amount: 2 }
  },
  {
    id: 'ns_008', name: 'Nightshade Beacon', faction: 'nightshade', type: 'artifact',
    rarity: 'epic', cost: 6, attack: 0, health: 5, maxHealth: 5,
    art: '🌐', keywords: [],
    effect: 'Шарды длительность +1. В начале хода — если есть шард, возьмите карту.',
    passive: { type: 'shard_extend', amount: 1 },
    onTurnStart: { type: 'conditional_draw', condition: 'shard_exists', amount: 1 }
  },
  {
    id: 'ns_009', name: 'Validator Node', faction: 'nightshade', type: 'creature',
    rarity: 'common', cost: 3, attack: 3, health: 3, maxHealth: 3,
    art: '🖥️', keywords: [],
    effect: 'Proof of Stake — +1/+1 каждые 2 хода.',
    onTurnStart: { type: 'scaling_buff', every: 2, attack: 1, health: 1 }
  },
  {
    id: 'ns_010', name: 'Cross-Shard Bridge', faction: 'nightshade', type: 'spell',
    rarity: 'rare', cost: 4, attack: 0, health: 0,
    art: '🔄', keywords: [],
    effect: 'Перенесите существо между шардами. Оно получает Charge.',
    onPlay: { type: 'move_shard', giveCharge: true }
  },
  {
    id: 'ns_011', name: 'Chunk Producer', faction: 'nightshade', type: 'creature',
    rarity: 'common', cost: 2, attack: 2, health: 3, maxHealth: 3,
    art: '📦', keywords: [],
    effect: 'Если в шарде 2+ существа — все +1 здоровья в конце хода.',
    onTurnEnd: { type: 'conditional_buff_all', condition: 'min_creatures', value: 2, health: 1 }
  },
  {
    id: 'ns_012', name: 'Doomslug Finality', faction: 'nightshade', type: 'spell',
    rarity: 'legendary', cost: 8, attack: 0, health: 0,
    art: '💥', keywords: [],
    effect: '8 урона всем вражеским существам. Если убито 3+ — создайте шард и призовите 4/4 Doomslug.',
    onPlay: { type: 'aoe_damage', damage: 8, condition: 'kill_count', threshold: 3, reward: { type: 'summon', card: 'Doomslug', attack: 4, health: 4 } }
  },

  // === IRONCLAW (12 карт) ===
  {
    id: 'ic_001', name: 'IronClaw', faction: 'ironclaw', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 5, health: 9, maxHealth: 9,
    art: '🐾', keywords: [],
    effect: 'Пассивка: TEE-защита — карты в руке невидимы. Активная: Confidential Mode — 2 хода все карты скрыты.',
    passive: { type: 'tee_protection', hideHand: true },
    active: { cost: 8, type: 'confidential_mode', duration: 2 }
  },
  {
    id: 'ic_002', name: 'AI Agent', faction: 'ironclaw', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 4, maxHealth: 4,
    art: '🤖', keywords: [],
    effect: 'Автоматически разыгрывает оптимальную карту из руки в конце хода.',
    onTurnEnd: { type: 'auto_play', ai: true }
  },
  {
    id: 'ic_003', name: 'Private Inference', faction: 'ironclaw', type: 'spell',
    rarity: 'epic', cost: 3, attack: 0, health: 0,
    art: '🔒', keywords: ['secret'],
    effect: 'Тайная карта. Разыгрывается лицом вниз. Раскрывается при условии.',
    onPlay: { type: 'secret', trigger: 'enemy_action' }
  },
  {
    id: 'ic_004', name: 'Agent Harness', faction: 'ironclaw', type: 'artifact',
    rarity: 'rare', cost: 5, attack: 0, health: 4, maxHealth: 4,
    art: '🎭', keywords: [],
    effect: 'Призывает AI-агента 2/2 каждые 3 хода. Агенты имеют TEE-защиту.',
    onTurnStart: { type: 'periodic_summon', every: 3, summon: { name: 'AI Agent', attack: 2, health: 2, tee: true } }
  },
  {
    id: 'ic_005', name: 'Confidential Mode', faction: 'ironclaw', type: 'spell',
    rarity: 'legendary', cost: 6, attack: 0, health: 0,
    art: '👁️', keywords: [],
    effect: '2 хода все ваши карты скрыты. Атаки невозможно заблокировать.',
    onPlay: { type: 'confidential_mode', duration: 2, unblockable: true }
  },
  {
    id: 'ic_006', name: 'TEE Enclave', faction: 'ironclaw', type: 'artifact',
    rarity: 'epic', cost: 4, attack: 0, health: 5, maxHealth: 5,
    art: '🛡️', keywords: [],
    effect: 'Одно существо получает TEE-защиту каждый ход. Если 3+ — все невосприимчивы к заклинаниям.',
    onTurnStart: { type: 'tee_buff', threshold: 3, global: true }
  },
  {
    id: 'ic_007', name: 'Zero-Knowledge Proof', faction: 'ironclaw', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '🔐', keywords: [],
    effect: 'Отмените эффект вражеской карты. Возьмите карту.',
    onPlay: { type: 'counter', draw: 1 }
  },
  {
    id: 'ic_008', name: 'Shadow Agent', faction: 'ironclaw', type: 'creature',
    rarity: 'common', cost: 2, attack: 2, health: 2, maxHealth: 2,
    art: '👤', keywords: ['stealth'],
    effect: 'Stealth. Если разыграна во время Confidential Mode — +2/+2 и Charge.',
    onPlay: { type: 'conditional_buff', condition: 'confidential_mode', attack: 2, health: 2, charge: true }
  },
  {
    id: 'ic_009', name: 'Neural Network', faction: 'ironclaw', type: 'spell',
    rarity: 'epic', cost: 7, attack: 0, health: 0,
    art: '🧠', keywords: [],
    effect: 'Скопируйте 3 карты из колоды врага. Они получают TEE-защиту и стоят на 1 меньше.',
    onPlay: { type: 'copy_from_enemy', count: 3, tee: true, discount: 1 }
  },
  {
    id: 'ic_010', name: 'Adversarial Attack', faction: 'ironclaw', type: 'spell',
    rarity: 'rare', cost: 5, attack: 0, health: 0,
    art: '🔥', keywords: [],
    effect: 'Урон, равный картам в руке врага. Если он видит вашу руку — удвоить.',
    onPlay: { type: 'damage_by_hand_size', multiplier: 1, visibleMultiplier: 2 }
  },
  {
    id: 'ic_011', name: 'Model Trainer', faction: 'ironclaw', type: 'creature',
    rarity: 'common', cost: 3, attack: 2, health: 3, maxHealth: 3,
    art: '📈', keywords: [],
    effect: '+1/+1 при разыгрывании заклинания. После 5 — эволюционирует в 5/5.',
    onSpellCast: { type: 'self_buff', attack: 1, health: 1 },
    evolve: { threshold: 5, attack: 5, health: 5 }
  },
  {
    id: 'ic_012', name: 'Dark Pool', faction: 'ironclaw', type: 'artifact',
    rarity: 'legendary', cost: 8, attack: 0, health: 6, maxHealth: 6,
    art: '🌑', keywords: [],
    effect: 'Обе руки скрыты. Каждый ход — автоматически разыгрываем верхнюю карту колоды.',
    passive: { type: 'dark_pool', autoPlay: true }
  },

  // === INTENTS (12 карт) ===
  {
    id: 'in_001', name: 'Elliott Braem', faction: 'intents', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 5, health: 7, maxHealth: 7,
    art: '🔗', keywords: [],
    effect: 'Пассивка: Chain Abstraction — мана 1:1 без потерь. Активная: меняет руки с врагом.',
    passive: { type: 'free_conversion' },
    active: { cost: 8, type: 'swap_hands', duration: 1 }
  },
  {
    id: 'in_002', name: 'Bridge', faction: 'intents', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '🌉', keywords: [],
    effect: 'Перенесите карту из колоды на стол, минуя руку. Charge, но -1/-1.',
    onPlay: { type: 'deck_to_field', charge: true, debuff: { attack: 1, health: 1 } }
  },
  {
    id: 'in_003', name: 'Universal Swap', faction: 'intents', type: 'spell',
    rarity: 'epic', cost: 5, attack: 0, health: 0,
    art: '🔄', keywords: [],
    effect: 'Поменяйте карту на случайную из колоды врага. Стоит на 2 меньше, Charge.',
    onPlay: { type: 'swap_with_enemy_deck', discount: 2, charge: true }
  },
  {
    id: 'in_004', name: '35+ Chains', faction: 'intents', type: 'spell',
    rarity: 'legendary', cost: 9, attack: 0, health: 0,
    art: '🌍', keywords: [],
    effect: 'Разыгрывает по одной карте из 3 доп. колод (цепей). Вы выбираете цепи.',
    onPlay: { type: 'multi_chain', count: 3, choose: true }
  },
  {
    id: 'in_005', name: 'Intent Declaration', faction: 'intents', type: 'spell',
    rarity: 'rare', cost: 2, attack: 0, health: 0,
    art: '🎯', keywords: [],
    effect: 'Объявите намерение. Система разыгрывает лучшую карту из руки автоматически.',
    onPlay: { type: 'intent', ai_select: true }
  },
  {
    id: 'in_006', name: 'Cross-Chain Hub', faction: 'intents', type: 'artifact',
    rarity: 'epic', cost: 6, attack: 0, health: 5, maxHealth: 5,
    art: '🏗️', keywords: [],
    effect: 'Храните до 3 карт вне цепи. Разыгрывайте их за +1 ману в любой момент.',
    passive: { type: 'off_chain_storage', max: 3, extraCost: 1 }
  },
  {
    id: 'in_007', name: 'Chain Scanner', faction: 'intents', type: 'creature',
    rarity: 'common', cost: 2, attack: 1, health: 3, maxHealth: 3,
    art: '🕵️', keywords: [],
    effect: 'В начале хода — смотрите верхнюю карту колоды врага. Можете положить вниз.',
    onTurnStart: { type: 'scry_enemy', amount: 1, canBottom: true }
  },
  {
    id: 'in_008', name: 'Liquidity Pool', faction: 'intents', type: 'artifact',
    rarity: 'rare', cost: 4, attack: 0, health: 4, maxHealth: 4,
    art: '💱', keywords: [],
    effect: 'Неразрыгранная мана превращается в случайную карту стоимостью этой маны.',
    onTurnEnd: { type: 'mana_to_card' }
  },
  {
    id: 'in_009', name: 'Fast Finality', faction: 'intents', type: 'spell',
    rarity: 'common', cost: 1, attack: 0, health: 0,
    art: '⚡', keywords: [],
    effect: 'Следующая карта разыгрывается немедленно (не тратит слот хода).',
    onPlay: { type: 'quick_cast', nextCard: true, excludeLegendary: true }
  },
  {
    id: 'in_010', name: 'Impersonator', faction: 'intents', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 3, maxHealth: 3,
    art: '🎭', keywords: [],
    effect: 'Становится копией случайного существа врага (статы + эффекты).',
    onPlay: { type: 'copy_enemy_creature', random: true }
  },
  {
    id: 'in_011', name: 'Omnichain Oracle', faction: 'intents', type: 'creature',
    rarity: 'epic', cost: 5, attack: 4, health: 4, maxHealth: 4,
    art: '🔮', keywords: [],
    effect: 'В начале хода — покажите верхние 2 карты обеих колод. Выберите одну в руку.',
    onTurnStart: { type: 'dual_scry', amount: 2, choose: true }
  },
  {
    id: 'in_012', name: 'Reversible Tx', faction: 'intents', type: 'spell',
    rarity: 'legendary', cost: 7, attack: 0, health: 0,
    art: '⏪', keywords: ['overload'],
    effect: 'Отмените последние 2 хода. Восстановите здоровье и карты. Перегрузка: пропустите ход.',
    onPlay: { type: 'rewind', turns: 2, overload: true }
  },

  // === HOUSE OF STAKE (12 карт) ===
  {
    id: 'st_001', name: 'Alexander Skidanov', faction: 'stake', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 4, health: 9, maxHealth: 9,
    art: '🏛️', keywords: [],
    effect: 'Пассивка: +1 мана за каждое существо. Активная: Governance Vote — выберите правило на 3 хода.',
    passive: { type: 'mana_per_creature', amount: 1 },
    active: { cost: 8, type: 'governance_vote', duration: 3, options: 3 }
  },
  {
    id: 'st_002', name: 'Stake & Earn', faction: 'stake', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '🔒', keywords: [],
    effect: 'Заморозьте существо на 2 хода. Получайте +2 маны каждый ход.',
    onPlay: { type: 'freeze', duration: 2, manaReward: 2 }
  },
  {
    id: 'st_003', name: 'Validator Node', faction: 'stake', type: 'creature',
    rarity: 'epic', cost: 5, attack: 3, health: 5, maxHealth: 5,
    art: '🖥️', keywords: [],
    effect: '+1/+1 каждые 2 хода. После 5 ходов — Taunt и Divine Shield.',
    onTurnStart: { type: 'scaling_buff', every: 2, attack: 1, health: 1 },
    evolve: { threshold: 5, taunt: true, divineShield: true }
  },
  {
    id: 'st_004', name: 'Governance Vote', faction: 'stake', type: 'spell',
    rarity: 'legendary', cost: 6, attack: 0, health: 0,
    art: '🗳️', keywords: [],
    effect: 'Выберите одно из 3 правил на 3 хода: (1) Все карты +1 мана, (2) Макс 1 атака, (3) Оба теряют 1 здоровье/ход.',
    onPlay: { type: 'governance', duration: 3, options: [
      { name: 'Tax', allCardsCost: 1 },
      { name: 'Limit', maxAttacks: 1 },
      { name: 'Burn', bothLoseHealth: 1 }
    ]}
  },
  {
    id: 'st_005', name: 'Staking Pool', faction: 'stake', type: 'artifact',
    rarity: 'epic', cost: 5, attack: 0, health: 5, maxHealth: 5,
    art: '🏦', keywords: [],
    effect: 'Замороженные существа дают +1 карту. Если 3+ заморожено — все +1/+1.',
    onTurnEnd: { type: 'stake_reward', draw: 1, threshold: 3, buffAll: { attack: 1, health: 1 } }
  },
  {
    id: 'st_006', name: 'Epoch End', faction: 'stake', type: 'spell',
    rarity: 'rare', cost: 4, attack: 0, health: 0,
    art: '⏳', keywords: [],
    effect: 'Разморозьте все существа. Каждое наносит урон, равный ходам в стейке.',
    onPlay: { type: 'unfreeze_all', damagePerTurn: 1 }
  },
  {
    id: 'st_007', name: 'Delegator', faction: 'stake', type: 'creature',
    rarity: 'common', cost: 2, attack: 1, health: 2, maxHealth: 2,
    art: '👥', keywords: [],
    effect: 'Когда заморожено — соседнее существо +2/+2. При разморозке — возьмите карту.',
    onFreeze: { type: 'adjacent_buff', attack: 2, health: 2 },
    onUnfreeze: { type: 'draw', amount: 1 }
  },
  {
    id: 'st_008', name: 'Proposal', faction: 'stake', type: 'spell',
    rarity: 'common', cost: 1, attack: 0, health: 0,
    art: '📜', keywords: [],
    effect: 'Следующая карта врага +2 маны. Или: следующая ваша -2 маны.',
    onPlay: { type: 'choose', options: [
      { target: 'enemy', nextCardCost: 2 },
      { target: 'self', nextCardDiscount: 2 }
    ]}
  },
  {
    id: 'st_009', name: 'Treasury', faction: 'stake', type: 'artifact',
    rarity: 'rare', cost: 6, attack: 0, health: 6, maxHealth: 6,
    art: '🏰', keywords: [],
    effect: 'Максимум маны +2. Неразрыгранная мана накапливается (макс +5).',
    passive: { type: 'mana_cap', bonus: 2, storage: 5 }
  },
  {
    id: 'st_010', name: 'Slashing', faction: 'stake', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '⚔️', keywords: [],
    effect: 'Уничтожьте замороженное существо врага. Урон герою = его атаке. Возьмите карту.',
    onPlay: { type: 'destroy_frozen', damageToHero: 'attack', draw: 1 }
  },
  {
    id: 'st_011', name: 'Consensus Guard', faction: 'stake', type: 'creature',
    rarity: 'common', cost: 4, attack: 2, health: 6, maxHealth: 6,
    art: '🛡️', keywords: ['taunt'],
    effect: 'Taunt. Если есть замороженное существо — Divine Shield в начале хода.',
    onTurnStart: { type: 'conditional_divine_shield', condition: 'frozen_exists' }
  },
  {
    id: 'st_012', name: 'DAO Treasury', faction: 'stake', type: 'spell',
    rarity: 'legendary', cost: 9, attack: 0, health: 0,
    art: '👑', keywords: ['overload'],
    effect: 'Призовите копии всех замороженных существ (разморожены). Все +2/+2 и Charge.',
    onPlay: { type: 'clone_frozen', buff: { attack: 2, health: 2 }, charge: true, overload: true }
  },

  // === AURORA (12 карт) ===
  {
    id: 'au_001', name: 'Aurora', faction: 'aurora', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 5, health: 8, maxHealth: 8,
    art: '🌈', keywords: [],
    effect: 'Пассивка: копируйте пассивку последней карты врага. Активная: соедините 2 существа.',
    passive: { type: 'mirror_passive' },
    active: { cost: 8, type: 'link_creatures', count: 2 }
  },
  {
    id: 'au_002', name: 'EVM Bridge', faction: 'aurora', type: 'spell',
    rarity: 'epic', cost: 4, attack: 0, health: 0,
    art: '🔄', keywords: [],
    effect: 'Превратите карту в руке в копию последней карты врага. Charge.',
    onPlay: { type: 'mirror_hand_card', charge: true }
  },
  {
    id: 'au_003', name: 'Rainbow Bridge', faction: 'aurora', type: 'artifact',
    rarity: 'rare', cost: 5, attack: 0, health: 4, maxHealth: 4,
    art: '🌉', keywords: [],
    effect: 'Соедините 2 существа. Они делят урон и атакуют вместе.',
    onPlay: { type: 'link', sharedDamage: true, combinedAttack: true }
  },
  {
    id: 'au_004', name: 'Gasless Transaction', faction: 'aurora', type: 'spell',
    rarity: 'common', cost: 0, attack: 0, health: 0,
    art: '⛽', keywords: [],
    effect: 'Следующая карта этого хода бесплатно. Одноразовая.',
    onPlay: { type: 'free_next', once: true }
  },
  {
    id: 'au_005', name: 'EVM Emulator', faction: 'aurora', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 4, maxHealth: 4,
    art: '📟', keywords: [],
    effect: 'Копирует ключевое слово случайного существа врага при разыгрывании.',
    onPlay: { type: 'copy_keyword', random: true }
  },
  {
    id: 'au_006', name: 'Aurora Borealis', faction: 'aurora', type: 'spell',
    rarity: 'legendary', cost: 8, attack: 0, health: 0,
    art: '🌌', keywords: [],
    effect: '3 урона всем существам. За каждое убитое — призовите его копию 1/1.',
    onPlay: { type: 'aoe_resurrect', damage: 3, summonStats: { attack: 1, health: 1 } }
  },
  {
    id: 'au_007', name: 'Compatibility Layer', faction: 'aurora', type: 'artifact',
    rarity: 'epic', cost: 5, attack: 0, health: 5, maxHealth: 5,
    art: '🔌', keywords: [],
    effect: 'Ваши карты любой фракции = Aurora. Копируйте эффект артефакта врага каждый ход.',
    passive: { type: 'faction_override', to: 'aurora' },
    onTurnStart: { type: 'copy_enemy_artifact' }
  },
  {
    id: 'au_008', name: 'Meta Transaction', faction: 'aurora', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '📨', keywords: [],
    effect: 'Возьмите 2 карты. Следующая карта врага копируется в вашу руку.',
    onPlay: { type: 'draw', amount: 2, copyNextEnemy: true }
  },
  {
    id: 'au_009', name: 'Rainbow Shard', faction: 'aurora', type: 'creature',
    rarity: 'common', cost: 3, attack: 2, health: 4, maxHealth: 4,
    art: '💎', keywords: [],
    effect: 'Когда существо врага получает бафф — этот получает такой же бафф.',
    onEnemyBuff: { type: 'mirror_buff' }
  },
  {
    id: 'au_010', name: 'Silk Road', faction: 'aurora', type: 'artifact',
    rarity: 'rare', cost: 4, attack: 0, health: 4, maxHealth: 4,
    art: '🐪', keywords: [],
    effect: 'Если у вас и врага одинаковое количество существ — оба берут по карте.',
    onTurnEnd: { type: 'symmetric_draw', condition: 'equal_creatures' }
  },
  {
    id: 'au_011', name: 'Fork', faction: 'aurora', type: 'spell',
    rarity: 'common', cost: 2, attack: 0, health: 0,
    art: '🍴', keywords: [],
    effect: 'Создайте копию существа в руке. Копия стоит на 1 меньше, -1/-1.',
    onPlay: { type: 'clone_hand_creature', discount: 1, debuff: { attack: 1, health: 1 } }
  },
  {
    id: 'au_012', name: 'Near Rainbow', faction: 'aurora', type: 'spell',
    rarity: 'legendary', cost: 9, attack: 0, health: 0,
    art: '🌈', keywords: ['overload'],
    effect: 'Скопируйте все существа врага (без эффектов). Ваши копии имеют Charge.',
    onPlay: { type: 'clone_all_enemy', stripEffects: true, charge: true, overload: true }
  },

  // === HOT PROTOCOL (12 карт) ===
  {
    id: 'ht_001', name: 'Petr Volnov', faction: 'hot', type: 'hero',
    rarity: 'legendary', cost: 10, attack: 6, health: 8, maxHealth: 8,
    art: '🔥', keywords: [],
    effect: 'Пассивка: MPC Network — все карты получают TEE-защиту. Активная: контролируйте 2 карты врага.',
    passive: { type: 'global_tee' },
    active: { cost: 8, type: 'mind_control', count: 2, duration: 1 }
  },
  {
    id: 'ht_002', name: 'Pasha', faction: 'hot', type: 'hero',
    rarity: 'epic', cost: 8, attack: 5, health: 6, maxHealth: 6,
    art: '⚡', keywords: [],
    effect: 'Пассивка: при разыгрывании артефакта — лечение 2 всем существам. Активная: все существа +2/+2 (+1/+1 если есть артефакт).',
    passive: { type: 'artifact_heal', amount: 2 },
    active: { cost: 6, type: 'buff_all', attack: 2, health: 2, artifactBonus: { attack: 1, health: 1 } }
  },
  {
    id: 'ht_003', name: 'HOT Miner', faction: 'hot', type: 'creature',
    rarity: 'common', cost: 2, attack: 2, health: 2, maxHealth: 2,
    art: '⛏️', keywords: [],
    effect: 'Token Mining — в конце хода получите 1 HOT Token (1 мана). Gasless: можно разыграть бесплатно при наличии HOT Token.',
    onTurnEnd: { type: 'generate_token', token: 'HOT', value: 1 },
    altCost: { type: 'token', token: 'HOT', amount: 1 }
  },
  {
    id: 'ht_004', name: 'MPC Node', faction: 'hot', type: 'creature',
    rarity: 'rare', cost: 5, attack: 3, health: 5, maxHealth: 5,
    art: '🖥️', keywords: ['tee_protection'],
    effect: 'TEE-защита. Если 2+ MPC Node — все существа получают Stealth.',
    passive: { type: 'tee' },
    onPlay: { type: 'conditional_stealth', condition: 'mpc_count', threshold: 2 }
  },
  {
    id: 'ht_005', name: 'HERE Wallet', faction: 'hot', type: 'artifact',
    rarity: 'epic', cost: 5, attack: 0, health: 5, maxHealth: 5,
    art: '👛', keywords: [],
    effect: 'Смотрите верхнюю карту колоды врага. Если заклинание — заставьте разыграть на себя. Seedless Recovery: при уничтожении — +5 здоровья, 2 карты.',
    onTurnStart: { type: 'spy_top_card', forcePlay: true },
    onDestroy: { type: 'heal_and_draw', health: 5, cards: 2 }
  },
  {
    id: 'ht_006', name: 'HOT Omni Token', faction: 'hot', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '🪙', keywords: ['cross_chain'],
    effect: 'Создайте 2 HOT Token'а. Или: уничтожьте 1 HOT Token, нанесите 3 урона. Cross-chain — без конвертации маны.',
    onPlay: { type: 'choose', options: [
      { type: 'generate_token', token: 'HOT', amount: 2 },
      { type: 'damage', consumeToken: 'HOT', damage: 3 }
    ]}
  },
  {
    id: 'ht_007', name: 'Templar Guard', faction: 'hot', type: 'creature',
    rarity: 'common', cost: 3, attack: 2, health: 4, maxHealth: 4,
    art: '🛡️', keywords: ['taunt'],
    effect: 'Taunt. Если есть артефакт — +1/+1 и Divine Shield.',
    onPlay: { type: 'conditional_buff', condition: 'has_artifact', attack: 1, health: 1, divineShield: true }
  },
  {
    id: 'ht_008', name: 'Lending Pool', faction: 'hot', type: 'artifact',
    rarity: 'rare', cost: 4, attack: 0, health: 4, maxHealth: 4,
    art: '🏦', keywords: [],
    effect: 'В конце хода — если есть HOT Token, превратите его в существо 2/2 с Charge.',
    onTurnEnd: { type: 'token_to_creature', token: 'HOT', summon: { attack: 2, health: 2, charge: true } }
  },
  {
    id: 'ht_009', name: 'Chain Abstractor', faction: 'hot', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 3, maxHealth: 3,
    art: '🔗', keywords: [],
    effect: 'При разыгрывании — разыграйте случайную карту из руки врага как свою на 1 ход.',
    onPlay: { type: 'borrow_enemy_card', duration: 1 }
  },
  {
    id: 'ht_010', name: 'DeFi Yield', faction: 'hot', type: 'spell',
    rarity: 'common', cost: 2, attack: 0, health: 0,
    art: '📈', keywords: [],
    effect: 'Получите 1 HOT Token. Если есть артефакт — ещё 1 HOT Token и +2 здоровья герою.',
    onPlay: { type: 'generate_token', token: 'HOT', amount: 1, artifactBonus: { token: 1, heroHealth: 2 } }
  },
  {
    id: 'ht_011', name: 'MPC Coordinator', faction: 'hot', type: 'creature',
    rarity: 'epic', cost: 6, attack: 4, health: 6, maxHealth: 6,
    art: '🌐', keywords: ['tee_protection'],
    effect: 'TEE-защита. Если 2+ MPC Node — все существа +1/+1 в начале хода.',
    passive: { type: 'tee' },
    onTurnStart: { type: 'conditional_buff_all', condition: 'mpc_count', threshold: 2, attack: 1, health: 1 }
  },
  {
    id: 'ht_012', name: 'HOT DAO Governance', faction: 'hot', type: 'spell',
    rarity: 'legendary', cost: 7, attack: 0, health: 0,
    art: '🏛️', keywords: [],
    effect: 'Выберите одно: (1) Все HOT Token'ы наносят 2 урона, (2) TEE-защита на 2 хода, (3) Возьмите 3 карты.',
    onPlay: { type: 'choose', options: [
      { type: 'token_damage', token: 'HOT', damage: 2 },
      { type: 'global_tee', duration: 2 },
      { type: 'draw', amount: 3 }
    ]}
  },

  // === INTEAR (12 карт) ===
  {
    id: 'it_001', name: 'Slime', faction: 'intear', type: 'hero',
    rarity: 'epic', cost: 7, attack: 4, health: 7, maxHealth: 7,
    art: '🦠', keywords: [],
    effect: 'Пассивка: UX Alchemist — заклинания на 1 дешевле. 0-мана карты = +1 карта. Активная: полный редроу с дискаунтом.',
    passive: { type: 'spell_discount', amount: 1, zeroBonus: 'draw' },
    active: { cost: 5, type: 'redraw', bonus: 1, discount: 1 }
  },
  {
    id: 'it_002', name: 'Intear Explorer', faction: 'intear', type: 'creature',
    rarity: 'rare', cost: 3, attack: 2, health: 3, maxHealth: 3,
    art: '🔍', keywords: ['ux'],
    effect: 'Разведка — смотрите 3 верхние карты колоды, берите одну. Open Source: при смерти — 2 карты.',
    onPlay: { type: 'scry', amount: 3, draw: 1 },
    onDeath: { type: 'draw', amount: 2 }
  },
  {
    id: 'it_003', name: 'Intear Wallet', faction: 'intear', type: 'artifact',
    rarity: 'rare', cost: 4, attack: 0, health: 4, maxHealth: 4,
    art: '💎', keywords: ['ux'],
    effect: 'UX-карты на 1 дешевле. Если не разыграли карту — берёте карту. Wallet Selector: любая фракция без штрафа.',
    passive: { type: 'ux_discount', amount: 1, noPlayBonus: 'draw', freeConversion: true }
  },
  {
    id: 'it_004', name: 'Intear Swap', faction: 'intear', type: 'spell',
    rarity: 'common', cost: 2, attack: 0, health: 0,
    art: '🔄', keywords: ['ux'],
    effect: 'Поменяйте карту из руки на случайную из колоды врага. -1 мана. UX Bonus: +1 карта при Intear Wallet.',
    onPlay: { type: 'swap_with_enemy_deck', discount: 1, walletBonus: 'draw' }
  },
  {
    id: 'it_005', name: 'UX Designer', faction: 'intear', type: 'creature',
    rarity: 'common', cost: 2, attack: 1, health: 3, maxHealth: 3,
    art: '🎨', keywords: ['ux'],
    effect: 'При разыгрывании заклинания — следующая карта -1 мана (минимум 0).',
    onSpellCast: { type: 'next_discount', amount: 1, min: 0 }
  },
  {
    id: 'it_006', name: 'Human Interface', faction: 'intear', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '👤', keywords: ['ux'],
    effect: 'Возьмите 2 карты. Следующая взятая карта стоит на 2 меньше.',
    onPlay: { type: 'draw', amount: 2, nextDrawDiscount: 2 }
  },
  {
    id: 'it_007', name: 'Open Source Spirit', faction: 'intear', type: 'creature',
    rarity: 'rare', cost: 3, attack: 2, health: 2, maxHealth: 2,
    art: '📖', keywords: ['ux'],
    effect: 'При смерти — все игроки берут по 1 карте. С Intear Wallet — вы 2, враг 1.',
    onDeath: { type: 'symmetric_draw', amount: 1, walletBonus: { self: 2, enemy: 1 } }
  },
  {
    id: 'it_008', name: 'Bug Bounty', faction: 'intear', type: 'spell',
    rarity: 'common', cost: 1, attack: 0, health: 0,
    art: '🐛', keywords: ['ux'],
    effect: '2 урона существу. Если уничтожено — возьмите карту и +1 мана.',
    onPlay: { type: 'damage', amount: 2, killBonus: { draw: 1, mana: 1 } }
  },
  {
    id: 'it_009', name: 'Intear Dashboard', faction: 'intear', type: 'artifact',
    rarity: 'epic', cost: 5, attack: 0, health: 5, maxHealth: 5,
    art: '📊', keywords: ['ux'],
    effect: 'Смотрите 2 верхние карты обеих колод. Берите одну. Все UX-карты +1/+1.',
    onTurnStart: { type: 'dual_scry', amount: 2, choose: true },
    passive: { type: 'ux_buff', attack: 1, health: 1 }
  },
  {
    id: 'it_010', name: 'Gasless UX', faction: 'intear', type: 'spell',
    rarity: 'common', cost: 0, attack: 0, health: 0,
    art: '⚡', keywords: ['ux'],
    effect: 'Следующая карта -1 мана. Если стала 0 — возьмите карту.',
    onPlay: { type: 'next_discount', amount: 1, zeroBonus: 'draw' }
  },
  {
    id: 'it_011', name: 'Community Builder', faction: 'intear', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 4, maxHealth: 4,
    art: '🤝', keywords: ['ux'],
    effect: 'В начале хода — если 3+ карт в руке — все существа +1/+1.',
    onTurnStart: { type: 'conditional_buff_all', condition: 'hand_size', threshold: 3, attack: 1, health: 1 }
  },
  {
    id: 'it_012', name: 'Intear Vision', faction: 'intear', type: 'spell',
    rarity: 'legendary', cost: 6, attack: 0, health: 0,
    art: '👁️', keywords: ['ux'],
    effect: 'Возьмите 3 карты. Все в руке на 1 дешевле до конца хода. С Intear Wallet — +1 карта.',
    onPlay: { type: 'draw', amount: 3, handDiscount: 1, walletBonus: { draw: 1 } }
  },

  // === NEAR LEGION (12 карт) ===
  {
    id: 'lg_001', name: 'Legion Commander', faction: 'legion', type: 'hero',
    rarity: 'legendary', cost: 9, attack: 5, health: 7, maxHealth: 7,
    art: '👑', keywords: [],
    effect: 'Пассивка: Rally the Troops — призыв 1/1 Recruit если <3 существ. Активная: все атакуют немедленно, убийство = карта.',
    passive: { type: 'auto_summon', condition: 'creature_count', threshold: 3, summon: { name: 'NEAR Recruit', attack: 1, health: 1 } },
    active: { cost: 7, type: 'mass_attack', drawPerKill: 1 }
  },
  {
    id: 'lg_002', name: 'NEAR Legionnaire', faction: 'legion', type: 'creature',
    rarity: 'rare', cost: 4, attack: 3, health: 4, maxHealth: 4,
    art: '🛡️', keywords: [],
    effect: 'Боевой клич — призывает 2/2 Legionnaire если есть другой легионер. Phalanx: 3+ легионера = +1/+1 и Taunt.',
    onPlay: { type: 'summon_if_exists', target: 'NEAR Legionnaire', summon: { attack: 2, health: 2 } },
    passive: { type: 'phalanx', threshold: 3, buff: { attack: 1, health: 1 }, keyword: 'taunt' }
  },
  {
    id: 'lg_003', name: 'Legion Banner', faction: 'legion', type: 'artifact',
    rarity: 'epic', cost: 6, attack: 0, health: 6, maxHealth: 6,
    art: '🚩', keywords: [],
    effect: 'Все существа на 1 дешевле. Legionnaire'ы +1/+1. Community Power: 5+ существ = Double Attack.',
    passive: { type: 'global_discount', amount: 1, target: 'creature' },
    onTurnStart: { type: 'conditional_keyword', condition: 'creature_count', threshold: 5, keyword: 'double_attack' }
  },
  {
    id: 'lg_004', name: 'Legion Charge', faction: 'legion', type: 'spell',
    rarity: 'rare', cost: 4, attack: 0, health: 0,
    art: '⚔️', keywords: [],
    effect: 'Все существа немедленно атакуют. +2 урона за каждое существо. 4+ существ — лечение 50% урона.',
    onPlay: { type: 'mass_attack', bonusPerCreature: 2, healPercent: 50, threshold: 4 }
  },
  {
    id: 'lg_005', name: 'NEAR Recruit', faction: 'legion', type: 'creature',
    rarity: 'common', cost: 1, attack: 1, health: 1, maxHealth: 1,
    art: '⚔️', keywords: ['charge'],
    effect: 'Charge. Если 3+ легионера — +1/+1.',
    onPlay: { type: 'conditional_buff', condition: 'legion_count', threshold: 3, attack: 1, health: 1 }
  },
  {
    id: 'lg_006', name: 'Veteran Soldier', faction: 'legion', type: 'creature',
    rarity: 'common', cost: 3, attack: 2, health: 3, maxHealth: 3,
    art: '🎖️', keywords: [],
    effect: 'Когда дружественный легионер атакует — может атаковать ту же цель бесплатно.',
    onAllyAttack: { type: 'follow_up', target: 'same', free: true }
  },
  {
    id: 'lg_007', name: 'War Horn', faction: 'legion', type: 'spell',
    rarity: 'common', cost: 2, attack: 0, health: 0,
    art: '📯', keywords: [],
    effect: 'Все существа +1/+0. Если 3+ существ — ещё +1/+0 и Charge.',
    onPlay: { type: 'buff_all', attack: 1, threshold: 3, extraAttack: 1, charge: true }
  },
  {
    id: 'lg_008', name: 'Shield Wall', faction: 'legion', type: 'spell',
    rarity: 'rare', cost: 3, attack: 0, health: 0,
    art: '🛡️', keywords: [],
    effect: 'Все существа +0/+2 и Taunt. Если 4+ — ещё Divine Shield.',
    onPlay: { type: 'buff_all', health: 2, keyword: 'taunt', threshold: 4, extra: 'divine_shield' }
  },
  {
    id: 'lg_009', name: 'Legion Camp', faction: 'legion', type: 'artifact',
    rarity: 'rare', cost: 4, attack: 0, health: 4, maxHealth: 4,
    art: '⛺', keywords: [],
    effect: 'В конце хода — если <3 существ, призовите 1/1 Recruit. Legionnaire'ы на 1 дешевле.',
    onTurnEnd: { type: 'auto_summon', condition: 'creature_count', threshold: 3, summon: { name: 'NEAR Recruit', attack: 1, health: 1 } },
    passive: { type: 'specific_discount', target: 'NEAR Legionnaire', amount: 1 }
  },
  {
    id: 'lg_010', name: 'Berserker', faction: 'legion', type: 'creature',
    rarity: 'rare', cost: 4, attack: 4, health: 3, maxHealth: 3,
    art: '😤', keywords: [],
    effect: 'При атаке — если 3+ легионера, наносит двойной урон.',
    onAttack: { type: 'conditional_double_damage', condition: 'legion_count', threshold: 3 }
  },
  {
    id: 'lg_011', name: 'Last Stand', faction: 'legion', type: 'spell',
    rarity: 'epic', cost: 5, attack: 0, health: 0,
    art: '💪', keywords: [],
    effect: 'Все существа +2/+2. Если у вас меньше здоровья — ещё +2/+2 и Charge.',
    onPlay: { type: 'buff_all', attack: 2, health: 2, lowHealthBonus: { attack: 2, health: 2, charge: true } }
  },
  {
    id: 'lg_012', name: 'Legion Immortal', faction: 'legion', type: 'creature',
    rarity: 'legendary', cost: 8, attack: 6, health: 6, maxHealth: 6,
    art: '👻', keywords: [],
    effect: 'При уничтожении — возвращается в руку через 2 хода (-2 маны). Если 5+ легионеров — немедленно.',
    onDeath: { type: 'return_to_hand', delay: 2, discount: 2, fastReturn: { condition: 'legion_count', threshold: 5 } }
  }
];

// Создание стартовых колод (30 карт каждая)
export const STARTER_DECKS = {
  nightshade: {
    name: 'Nightshade',
    faction: 'nightshade',
    cards: [
      'ns_001', 'ns_002', 'ns_002', 'ns_002', 'ns_003', 'ns_003',
      'ns_004', 'ns_004', 'ns_005', 'ns_006', 'ns_006', 'ns_007',
      'ns_007', 'ns_007', 'ns_008', 'ns_009', 'ns_009', 'ns_009',
      'ns_010', 'ns_010', 'ns_011', 'ns_011', 'ns_011', 'ns_012',
      'ns_003', 'ns_004', 'ns_006', 'ns_008', 'ns_010', 'ns_012'
    ]
  },
  ironclaw: {
    name: 'IronClaw',
    faction: 'ironclaw',
    cards: [
      'ic_001', 'ic_002', 'ic_002', 'ic_003', 'ic_003', 'ic_004',
      'ic_005', 'ic_006', 'ic_007', 'ic_007', 'ic_008', 'ic_008',
      'ic_008', 'ic_009', 'ic_010', 'ic_010', 'ic_011', 'ic_011',
      'ic_011', 'ic_012', 'ic_002', 'ic_003', 'ic_004', 'ic_006',
      'ic_007', 'ic_009', 'ic_010', 'ic_011', 'ic_012', 'ic_001'
    ]
  },
  intents: {
    name: 'Intents',
    faction: 'intents',
    cards: [
      'in_001', 'in_002', 'in_002', 'in_003', 'in_004', 'in_005',
      'in_005', 'in_006', 'in_007', 'in_007', 'in_008', 'in_009',
      'in_009', 'in_009', 'in_010', 'in_010', 'in_011', 'in_012',
      'in_002', 'in_003', 'in_005', 'in_007', 'in_008', 'in_010',
      'in_011', 'in_012', 'in_001', 'in_004', 'in_006', 'in_011'
    ]
  },
  stake: {
    name: 'House of Stake',
    faction: 'stake',
    cards: [
      'st_001', 'st_002', 'st_002', 'st_002', 'st_003', 'st_004',
      'st_005', 'st_006', 'st_006', 'st_007', 'st_007', 'st_007',
      'st_008', 'st_008', 'st_009', 'st_010', 'st_010', 'st_011',
      'st_011', 'st_012', 'st_002', 'st_003', 'st_005', 'st_006',
      'st_007', 'st_008', 'st_009', 'st_010', 'st_011', 'st_012'
    ]
  },
  aurora: {
    name: 'Aurora',
    faction: 'aurora',
    cards: [
      'au_001', 'au_002', 'au_002', 'au_003', 'au_004', 'au_004',
      'au_004', 'au_005', 'au_006', 'au_007', 'au_008', 'au_008',
      'au_009', 'au_009', 'au_010', 'au_011', 'au_011', 'au_012',
      'au_002', 'au_003', 'au_005', 'au_006', 'au_007', 'au_008',
      'au_009', 'au_010', 'au_011', 'au_012', 'au_001', 'au_004'
    ]
  },
  hot: {
    name: 'HOT Protocol',
    faction: 'hot',
    cards: [
      'ht_001', 'ht_002', 'ht_003', 'ht_003', 'ht_003', 'ht_004',
      'ht_004', 'ht_005', 'ht_006', 'ht_006', 'ht_007', 'ht_007',
      'ht_008', 'ht_009', 'ht_010', 'ht_010', 'ht_011', 'ht_012',
      'ht_003', 'ht_004', 'ht_005', 'ht_006', 'ht_007', 'ht_008',
      'ht_009', 'ht_010', 'ht_011', 'ht_012', 'ht_001', 'ht_002'
    ]
  },
  intear: {
    name: 'Intear',
    faction: 'intear',
    cards: [
      'it_001', 'it_002', 'it_002', 'it_003', 'it_004', 'it_004',
      'it_005', 'it_005', 'it_006', 'it_007', 'it_008', 'it_008',
      'it_009', 'it_010', 'it_010', 'it_011', 'it_011', 'it_012',
      'it_002', 'it_003', 'it_004', 'it_005', 'it_006', 'it_007',
      'it_008', 'it_009', 'it_010', 'it_011', 'it_012', 'it_001'
    ]
  },
  legion: {
    name: 'NEAR Legion',
    faction: 'legion',
    cards: [
      'lg_001', 'lg_002', 'lg_002', 'lg_003', 'lg_004', 'lg_004',
      'lg_005', 'lg_005', 'lg_005', 'lg_006', 'lg_006', 'lg_007',
      'lg_007', 'lg_008', 'lg_008', 'lg_009', 'lg_010', 'lg_010',
      'lg_011', 'lg_012', 'lg_002', 'lg_003', 'lg_004', 'lg_005',
      'lg_006', 'lg_007', 'lg_008', 'lg_009', 'lg_010', 'lg_011'
    ]
  }
};

// Получить карту по ID
export function getCardById(id) {
  return ALL_CARDS.find(c => c.id === id);
}

// Получить стартовую колоду
export function getStarterDeck(faction) {
  const deck = STARTER_DECKS[faction];
  if (!deck) return null;
  return {
    ...deck,
    cards: deck.cards.map(id => getCardById(id)).filter(Boolean)
  };
}

// Получить все карты фракции
export function getFactionCards(faction) {
  return ALL_CARDS.filter(c => c.faction === faction);
}

export default { ALL_CARDS, STARTER_DECKS, FACTIONS, RARITIES, CARD_TYPES, getCardById, getStarterDeck, getFactionCards };
