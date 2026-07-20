// ===== NEAR LEGENDS — Главный файл =====

import { GameEngine } from './game/engine.js';
import { GameBoard } from './components/GameBoard.js';
import { getStarterDeck, FACTIONS } from './cards/cardData.js';

let currentGame = null;
let selectedDeck = null;

// ===== Инициализация =====
function init() {
  showTitleScreen();
}

// ===== Экран заголовка =====
function showTitleScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen active title-screen">
      <h1>⚔️ NEAR Legends</h1>
      <p class="subtitle">Карточная игра экосистемы NEAR Protocol</p>

      <div style="display:flex;flex-direction:column;gap:15px;align-items:center;margin-top:40px;">
        <button class="btn btn-primary" id="btn-play" style="font-size:18px;padding:16px 40px;">
          🎮 Играть
        </button>
        <button class="btn" id="btn-collection" style="font-size:14px;">
          📚 Коллекция карт
        </button>
        <button class="btn" id="btn-rules" style="font-size:14px;">
          📖 Правила
        </button>
      </div>

      <div style="margin-top:60px;display:flex;gap:15px;flex-wrap:wrap;justify-content:center;">
        ${Object.entries(FACTIONS).map(([key, f]) => `
          <span style="padding:6px 12px;background:${f.color}20;border:1px solid ${f.color}40;border-radius:20px;font-size:12px;color:${f.color};">
            ${f.icon} ${f.name}
          </span>
        `).join('')}
      </div>

      <p style="margin-top:40px;font-size:12px;color:#475569;">
        v1.0.0 • 96 карт • 8 фракций • Браузерная версия
      </p>
    </div>
  `;

  document.getElementById('btn-play').addEventListener('click', showDeckSelect);
  document.getElementById('btn-collection').addEventListener('click', showCollection);
  document.getElementById('btn-rules').addEventListener('click', showRules);
}

// ===== Выбор колоды =====
function showDeckSelect() {
  window.showDeckSelect = showDeckSelect; // Для доступа из GameBoard

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen active">
      <h2 style="margin-bottom:10px;">Выберите вашу колоду</h2>
      <p style="color:#94a3b8;margin-bottom:30px;">Каждая фракция имеет уникальную механику</p>

      <div class="deck-select-grid">
        ${Object.entries(FACTIONS).map(([key, f]) => `
          <div class="deck-card" data-faction="${key}" style="border-color:${f.color}40;">
            <div class="deck-icon">${f.icon}</div>
            <div class="deck-name" style="color:${f.color};">${f.name}</div>
            <div class="deck-desc">${getFactionDesc(key)}</div>
            <div style="margin-top:10px;font-size:11px;color:#475569;">
              Герой: ${f.hero}
            </div>
          </div>
        `).join('')}
      </div>

      <button class="btn" onclick="showTitleScreen()" style="margin-top:30px;">
        ← Назад
      </button>
    </div>
  `;

  document.querySelectorAll('.deck-card').forEach(card => {
    card.addEventListener('click', () => {
      const faction = card.dataset.faction;
      selectedDeck = getStarterDeck(faction);

      // Выбор колоды врага (случайно)
      const enemyFactions = Object.keys(FACTIONS).filter(f => f !== faction);
      const enemyFaction = enemyFactions[Math.floor(Math.random() * enemyFactions.length)];
      const enemyDeck = getStarterDeck(enemyFaction);

      startGame(selectedDeck, enemyDeck);
    });
  });
}

function getFactionDesc(faction) {
  const descs = {
    nightshade: 'Шарды и параллельное исполнение',
    ironclaw: 'TEE-защита и AI-агенты',
    intents: 'Chain Abstraction и кража карт',
    stake: 'Стейкинг и пассивный доход',
    aurora: 'Копирование и EVM-совместимость',
    hot: 'MPC-ноды и HOT Token'ы',
    intear: 'UX-скидки и быстрые заклинания',
    legion: 'Массовые призывы и фаланга'
  };
  return descs[faction] || '';
}

// ===== Начало игры =====
function startGame(playerDeck, enemyDeck) {
  const app = document.getElementById('app');
  app.innerHTML = '<div id="game-container" style="width:100%;min-height:100vh;"></div>';

  currentGame = new GameEngine(playerDeck, enemyDeck);
  currentGame.startGame();

  const container = document.getElementById('game-container');
  const board = new GameBoard(currentGame, container);

  // Сохранение в localStorage
  saveGameState();
}

function saveGameState() {
  if (currentGame) {
    localStorage.setItem('nearLegends_save', currentGame.serialize());
  }
}

function loadGameState() {
  const saved = localStorage.getItem('nearLegends_save');
  if (saved) {
    try {
      currentGame = GameEngine.deserialize(saved);
      const app = document.getElementById('app');
      app.innerHTML = '<div id="game-container" style="width:100%;min-height:100vh;"></div>';
      const container = document.getElementById('game-container');
      new GameBoard(currentGame, container);
      return true;
    } catch (e) {
      console.error('Failed to load save:', e);
      localStorage.removeItem('nearLegends_save');
    }
  }
  return false;
}

// ===== Коллекция карт =====
function showCollection() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen active">
      <h2 style="margin-bottom:20px;">📚 Коллекция карт</h2>

      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;justify-content:center;">
        <button class="btn" onclick="filterCollection('all')">Все</button>
        ${Object.entries(FACTIONS).map(([key, f]) => `
          <button class="btn" onclick="filterCollection('${key}')" style="border-color:${f.color};">
            ${f.icon} ${f.name}
          </button>
        `).join('')}
      </div>

      <div id="collection-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:15px;max-width:1200px;width:100%;">
        <!-- Карты загружаются динамически -->
      </div>

      <button class="btn" onclick="showTitleScreen()" style="margin-top:30px;">
        ← Назад
      </button>
    </div>
  `;

  // Загрузка карт
  import('./cards/cardData.js').then(({ ALL_CARDS }) => {
    renderCollection(ALL_CARDS);
  });
}

function renderCollection(cards) {
  const grid = document.getElementById('collection-grid');
  if (!grid) return;

  grid.innerHTML = cards.map(card => `
    <div class="card ${card.faction} ${card.rarity}" style="cursor:default;">
      <div class="card-header">
        <div class="card-cost">${card.cost}</div>
        <div class="card-rarity">${card.rarity[0].toUpperCase()}</div>
      </div>
      <div class="card-art">${card.art || '✨'}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-type">${card.type}</div>
      <div class="card-stats">
        ${card.type !== 'spell' && card.type !== 'artifact' ? `<div class="card-attack">${card.attack}</div>` : '<div></div>'}
        <div class="card-faction">${FACTIONS[card.faction]?.icon || '⚪'}</div>
        ${card.type !== 'spell' ? `<div class="card-health">${card.health}</div>` : '<div></div>'}
      </div>
    </div>
  `).join('');
}

window.filterCollection = (faction) => {
  import('./cards/cardData.js').then(({ ALL_CARDS }) => {
    const filtered = faction === 'all' ? ALL_CARDS : ALL_CARDS.filter(c => c.faction === faction);
    renderCollection(filtered);
  });
};

// ===== Правила =====
function showRules() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen active" style="max-width:800px;margin:0 auto;text-align:left;">
      <h2 style="text-align:center;margin-bottom:20px;">📖 Правила игры</h2>

      <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:15px;">
        <h3 style="color:#a855f7;margin-bottom:10px;">🎯 Цель игры</h3>
        <p style="color:#94a3b8;line-height:1.6;">
          Снизьте здоровье героя противника до 0. У каждого героя 30 здоровья (для героев из данных — их базовое здоровье).
        </p>
      </div>

      <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:15px;">
        <h3 style="color:#a855f7;margin-bottom:10px;">🎴 Ход</h3>
        <p style="color:#94a3b8;line-height:1.6;">
          1. <strong>Начало хода:</strong> +1 мана (макс 10), возьмите карту<br>
          2. <strong>Основная фаза:</strong> разыгрывайте карты, призывайте существ, активируйте способности<br>
          3. <strong>Боевая фаза:</strong> атакуйте существами<br>
          4. <strong>Конец хода:</strong> нажмите "Закончить ход"
        </p>
      </div>

      <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:15px;">
        <h3 style="color:#a855f7;margin-bottom:10px;">⚔️ Бой</h3>
        <p style="color:#94a3b8;line-height:1.6;">
          • Существа с <strong>Charge</strong> могут атаковать сразу<br>
          • Обычные существа не могут атаковать в ход призыва<br>
          • При атаке существа наносят урон друг другу (контратака)<br>
          • <strong>Taunt</strong> — враг обязан атаковать это существо<br>
          • <strong>Stealth</strong> — невидимо до первой атаки
        </p>
      </div>

      <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:15px;">
        <h3 style="color:#a855f7;margin-bottom:10px;">🌟 Уникальные механики</h3>
        <p style="color:#94a3b8;line-height:1.6;">
          <strong>🌙 Шарды (Nightshade):</strong> Доска делится на зоны с независимой маной<br>
          <strong>🔒 TEE-защита (IronClaw):</strong> Карты невидимы для эффектов врага<br>
          <strong>🔗 Intents:</strong> Объявляйте намерения — система подбирает оптимальную карту<br>
          <strong>🔒 Стейкинг (Stake):</strong> Замораживайте существ для пассивного дохода<br>
          <strong>🌈 EVM Bridge (Aurora):</strong> Копируйте карты врага<br>
          <strong>🔥 HOT Token'ы:</strong> Артефакты-валюта для альтернативной оплаты<br>
          <strong>🦠 UX (Intear):</strong> Заклинания стоят дешевле<br>
          <strong>🛡️ Phalanx (Legion):</strong> Бонусы при 3+ одинаковых существах
        </p>
      </div>

      <button class="btn" onclick="showTitleScreen()" style="margin-top:20px;">
        ← Назад
      </button>
    </div>
  `;
}

// ===== Запуск =====
window.showTitleScreen = showTitleScreen;
window.showDeckSelect = showDeckSelect;

// Проверка сохранения при загрузке
if (!loadGameState()) {
  init();
}

// Автосохранение каждые 30 секунд
setInterval(saveGameState, 30000);

export { showTitleScreen, showDeckSelect, startGame };
