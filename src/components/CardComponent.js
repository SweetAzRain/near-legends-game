// ===== Компонент карты =====

export function createCardElement(card, options = {}) {
  const { inHand = false, inField = false, selected = false, playable = false, small = false } = options;

  const el = document.createElement('div');
  el.className = `card ${card.faction} ${card.rarity}`;
  el.dataset.cardId = card.instanceId || card.id;

  if (selected) el.classList.add('selected');
  if (playable) el.classList.add('playable');
  if (small) el.style.cssText = 'width:100px;height:140px;font-size:10px;';

  // TEE-защита
  if (card.tee || card.keywords?.includes('tee_protection')) {
    const shield = document.createElement('div');
    shield.className = 'tee-shield';
    el.appendChild(shield);
  }

  // Заморозка
  if (card.frozen) el.classList.add('frozen');

  // Stealth
  if (card.stealth) el.classList.add('stealth');

  const attack = card.attack || 0;
  const health = card.currentHealth || card.health || 0;
  const maxHealth = card.maxHealth || card.health || 0;
  const cost = card.cost || 0;

  el.innerHTML = `
    <div class="card-header">
      <div class="card-cost">${cost}</div>
      <div class="card-rarity">${getRarityShort(card.rarity)}</div>
    </div>
    <div class="card-art">${card.art || '✨'}</div>
    <div class="card-name">${card.name}</div>
    <div class="card-type">${getTypeName(card.type)}</div>
    <div class="card-stats">
      ${card.type !== 'spell' && card.type !== 'artifact' ? `
        <div class="card-attack">${attack}</div>
      ` : '<div></div>'}
      <div class="card-faction">${getFactionIcon(card.faction)}</div>
      ${card.type !== 'spell' ? `
        <div class="card-health" style="${health < maxHealth ? 'background:#dc2626;' : ''}">${health}</div>
      ` : '<div></div>'}
    </div>
  `;

  // Тултип
  el.addEventListener('mouseenter', (e) => showTooltip(e, card));
  el.addEventListener('mouseleave', hideTooltip);

  return el;
}

function getRarityShort(rarity) {
  const map = { legendary: 'L', epic: 'E', rare: 'R', common: 'C' };
  return map[rarity] || '?';
}

function getTypeName(type) {
  const map = { hero: 'Герой', creature: 'Существо', spell: 'Заклинание', artifact: 'Артефакт' };
  return map[type] || type;
}

function getFactionIcon(faction) {
  const map = {
    nightshade: '🌙', ironclaw: '🐾', intents: '🔗',
    stake: '🏛️', aurora: '🌈', hot: '🔥',
    intear: '🦠', legion: '🛡️'
  };
  return map[faction] || '⚪';
}

function showTooltip(e, card) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.id = 'active-tooltip';
  tooltip.innerHTML = `
    <strong style="color:${getFactionColor(card.faction)}">${card.name}</strong><br>
    <span style="color:#94a3b8">${getTypeName(card.type)} • ${getRarityName(card.rarity)}</span><br><br>
    ${card.effect || 'Нет эффекта'}<br>
    ${card.keywords?.length ? `<br><span style="color:#fbbf24">${card.keywords.join(', ')}</span>` : ''}
  `;
  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.right + 10 + 'px';
  tooltip.style.top = rect.top + 'px';
}

function hideTooltip() {
  const t = document.getElementById('active-tooltip');
  if (t) t.remove();
}

function getFactionColor(faction) {
  const map = {
    nightshade: '#a855f7', ironclaw: '#ef4444', intents: '#06b6d4',
    stake: '#f59e0b', aurora: '#10b981', hot: '#f97316',
    intear: '#ec4899', legion: '#6366f1'
  };
  return map[faction] || '#fff';
}

function getRarityName(rarity) {
  const map = {
    legendary: 'Легендарная', epic: 'Эпическая',
    rare: 'Редкая', common: 'Обычная'
  };
  return map[rarity] || rarity;
}

export function createHeroElement(hero, player) {
  const el = document.createElement('div');
  el.className = 'hero-avatar';
  el.style.borderColor = getFactionColor(player.faction);
  el.innerHTML = hero.art || '👤';
  return el;
}

export function createManaCrystals(current, max) {
  const container = document.createElement('div');
  container.className = 'hero-mana';
  for (let i = 0; i < max; i++) {
    const crystal = document.createElement('div');
    crystal.className = `mana-crystal ${i >= current ? 'spent' : ''}`;
    crystal.textContent = i < current ? '💎' : '';
    container.appendChild(crystal);
  }
  return container;
}

export function createHealthBar(current, max) {
  const container = document.createElement('div');
  container.className = 'hero-health-bar';
  const fill = document.createElement('div');
  fill.className = 'hero-health-fill';
  fill.style.width = `${(current / max) * 100}%`;
  container.appendChild(fill);
  return container;
}

export default { createCardElement, createHeroElement, createManaCrystals, createHealthBar };
