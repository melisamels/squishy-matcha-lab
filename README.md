# 🍵 Squishy Factory: Matcha Lab ✨

> **Create • Collect • Decorate • Sell**  
> A cozy, kawaii, pastel web game about running your very own handcrafted squishy factory alongside Momo the rabbit guide!

---

## 🌸 About the Game

**“Squishy Factory: Matcha Lab”** is an interactive, child-friendly (ages 9–12) cozy simulation game with rich pastel aesthetics, Japanese stationery vibes, and endless squishy fun.

* **Matcha Green, Soft Cream, Berry Pink, Lavender, and Pastel Yellow palette.**
* **Momo the Mascot**: An adorable white rabbit in a green apron who guides you on secret recipes and workshop tips.
* **100% Offline-Ready Procedural Graphics**: Crisp SVG vector squishy rendering engine with live click-to-squish physics!
* **Built-in Web Audio Synthesizer**: Kawaii Lofi Matcha Café BGM and soft squishy sound effects created via Web Audio API—no external audio files needed!
* **Full Local Persistence**: Autosaves seamlessly to `localStorage`.

---

## 🎮 Key Features

### 🧪 1. The Squishy Lab (Core Maker Workshop)
* **7 Progressive Stages**: Shape ➔ Color ➔ Face ➔ Accessories ➔ Scent ➔ Packaging ➔ Create.
* **21 Molds**: Bunny, Cat, Strawberry, Croissant, Panda, Bear, Duck, Cloud, Star, Heart, Donut, Cupcake, Matcha Cup, Toast, Milk Carton, Axolotl, Frog, Dinosaur, Whale, Moon, Unicorn.
* **20 Pastel & Specialty Colors**: Solid pastels, gradients (Galaxy, Rainbow, Sunset, Sakura), and marble patterns with rarity bonus boosts.
* **10 Kawaii Faces**: Happy, Shy, Sleepy, Excited, Blushing, Cool, Yummy, Love, Tiny, UwU.
* **20 Accessories**: Bows, clips, hats, angel wings, devil horns, and royal crowns (with shape conflict prevention).
* **17 Scents**: Matcha, Strawberry, Vanilla, Sakura Blossom, Wild Honey, Salted Caramel, Secret Mystery Scent.
* **8 Packagings**: From crinkly basic bags up to x1.5 multiplier Golden Collector Boxes.
* **Interactive Squish Physics**: Click any squishy to squish it down 15% and watch it bounce back with cute sound effects!
* **Animated Machine Sequence**: Staged creation flow (*Mixing ➔ Adding color ➔ Adding scent ➔ Squishifying ➔ Packaging*).

### 📖 2. 150-Item Collection Book & 32 Secret Recipes
* 150 unique squishies across 9 categories:
  * 🐰 Bunny Collection (15)
  * 🐱 Cat Collection (15)
  * 🥐 Food Collection (20)
  * 🧸 Animal Collection (25)
  * 🍵 Matcha Collection (20)
  * 🍩 Sweet Collection (20)
  * ☁️ Fantasy Collection (15)
  * 👑 Legendary Collection (10)
  * 💖 Secret Collection (10)
* Undiscovered entries display as mystery silhouettes with poetic clues.
* Milestone rewards at 10%, 25%, 50%, 75%, and 100% (Grand Master celebration).
* Over **30 Secret Recipes** (e.g. *Sakura Matcha Bunny*, *Golden Honey Panda*, *Galaxy Moon Cat*, *Rainbow Cloud Bear*, *Momo Special Bunny*).

### 🛏️ 3. My Room (Decorate & Display)
* 8 Display Positions: *Shelf 1, Shelf 2, Desk, Bed, Window Shelf, Display Cabinet, Side Table, Cozy Rug*.
* Click placed squishies to squish, inspect, or favorite them.
* Customizable wallpapers, flooring, and rugs across 7 pastel themes (*Matcha, Strawberry, Cloud, Sakura, Ocean, Galaxy, Princess*).

### 🛍️ 4. Squishy Shop & Customer Orders
* Sell squishies from your bag with clear coin confirmations.
* Meet visiting customers: **Mimi, Lulu, Coco, Boba, Pip, and Hana**.
* Fulfill up to 3 active customer desire orders for juicy coin and XP bonuses!

### 🏪 5. Material Store
* Use coins to unlock new molds, rare colors, crowns, and collector boxes with level gates.

### 🎯 6. Missions, Achievements & Daily Streak
* 3 Daily Missions + completion Mystery Box bonus.
* Long-term progression quests and 10 unlockable achievements.
* 7-day login streak calendar with escalating rewards.
* Lucky Mystery Box unboxing minigame!

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite 8
* **Styling**: Tailwind CSS v4, Custom CSS Kawaii Animations
* **State Management**: Zustand with `persist` middleware (`localStorage`)
* **Audio**: Custom Web Audio API Synthesizer (Lofi Matcha Café Generator + Kawaii SFX)
* **Icons & Effects**: Lucide React, Canvas-Confetti
* **Typography**: Fredoka & Quicksand (Google Fonts)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/melisamels/squishy-matcha-lab.git
cd squishy-matcha-lab
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 🐰 Credits & License

Created with love for cute squishy lovers everywhere.  
MIT License.

