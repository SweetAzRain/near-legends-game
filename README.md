# ⚔️ NEAR Legends

Карточная игра в стиле Hearthstone, посвящённая экосистеме **NEAR Protocol**. 96 карт, 8 фракций, уникальные механики блокчейна.

![Фракции](https://img.shields.io/badge/Фракции-8-purple)
![Карты](https://img.shields.io/badge/Карты-96-blue)
![Версия](https://img.shields.io/badge/Версия-1.0.0-green)

## 🎮 Демо

Игра развёрнута на Cloudflare Pages: **[near-legends.pages.dev](https://near-legends.pages.dev)**

## 🚀 Быстрый старт

```bash
# Клонирование
git clone https://github.com/username/near-legends.git
cd near-legends

# Установка зависимостей
npm install

# Запуск локального сервера
npm run dev

# Сборка для production
npm run build

# Деплой на Cloudflare Pages
npm run deploy
```

## 📁 Структура проекта

```
near-legends/
├── index.html              # Точка входа
├── package.json            # Зависимости
├── vite.config.js          # Конфиг Vite
├── README.md               # Этот файл
├── src/
│   ├── main.js             # Главный файл (UI, экраны)
│   ├── assets/
│   │   └── styles.css      # Глобальные стили
│   ├── cards/
│   │   └── cardData.js     # 96 карт, 8 колод
│   ├── components/
│   │   ├── CardComponent.js # Рендер карт
│   │   └── GameBoard.js    # Игровое поле
│   └── game/
│       └── engine.js       # Игровая логика
└── public/
    └── assets/             # Статические файлы
```

## 🃏 Фракции

| Фракция | Герой | Механика | Сложность |
|---------|-------|----------|-----------|
| 🌙 **Nightshade** | Illia Polosukhin | Шарды — разделение доски | ★★★★☆ |
| 🐾 **IronClaw** | IronClaw | TEE-защита, скрытые карты | ★★★★★ |
| 🔗 **Intents** | Elliott Braem | Chain Abstraction, кража | ★★★★★ |
| 🏛️ **House of Stake** | Alexander Skidanov | Стейкинг, пассивный доход | ★★★☆☆ |
| 🌈 **Aurora** | Aurora | Копирование карт врага | ★★★☆☆ |
| 🔥 **HOT Protocol** | Petr Volnov | MPC-ноды, HOT Token'ы | ★★★★☆ |
| 🦠 **Intear** | Slime | UX-скидки, быстрые заклинания | ★★★☆☆ |
| 🛡️ **NEAR Legion** | Legion Commander | Массовые призывы, Phalanx | ★★☆☆☆ |

## 🎯 Ключевые механики

- **Шарды** — доска делится на независимые зоны с собственной маной
- **TEE-защита** — карты невидимы для эффектов врага
- **Intents** — объявляйте намерения, система подбирает оптимальную карту
- **Стейкинг** — замораживайте существ для пассивного дохода
- **HOT Token'ы** — артефакты-валюта для альтернативной оплаты
- **Phalanx** — бонусы при наличии 3+ одинаковых существ

## 🛠️ Технологии

- **Vite** — сборка и dev-сервер
- **Vanilla JS** — без фреймворков, максимальная производительность
- **CSS3** — анимации, градиенты, адаптивность
- **Cloudflare Pages** — хостинг и CDN
- **Wrangler** — CLI для деплоя

## 📝 TODO

- [ ] Мультиплеер через WebSocket
- [ ] Интеграция NEAR Wallet для авторизации
- [ ] NFT-карты (мятить на блокчейне)
- [ ] Рейтинговая система
- [ ] Турниры
- [ ] Мобильное приложение (PWA)

## 📄 Лицензия

MIT License — свободное использование и модификация.

## 🙏 Благодарности

- **NEAR Protocol** — за вдохновение и экосистему
- **Illia Polosukhin** — сооснователь NEAR, автор Transformer
- **Petr Volnov** — HOT Protocol
- **Slime** — Intear Wallet
- **Сообщество NEAR Legion** — за поддержку
