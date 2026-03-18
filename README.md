# ShopPlanr — Web App (React TS)

> A smart shopping planner that helps you organize your grocery runs, set budgets, and track your actual spending in real time.

---

## 🖥️ Screenshots

| Dashboard                                    | Plan Details                               | Shopping Mode                                 |
| -------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| ![Dashboard](./screenshots/landing-list.png) | ![Details](./screenshots/plan-details.png) | ![Shopping](./screenshots/start-shopping.png) |

---

## ✨ Features

- 📋 **Create Shopping Plans** — Set up a plan with a store location, scheduled date, and total budget before your shopping trip.
- 🛒 **Plan Your Items** — Add the items you intend to buy, including the planned quantity for each.
- 📍 **Store Location** — Attach a location to each plan so you know exactly where you're headed.
- 📅 **Scheduled Date** — Set a date for the trip so your plans are organized chronologically.
- ✅ **Shopping Mode** — When the scheduled date arrives, activate the plan to start recording your actual purchases.
- 💰 **Real-time Budget Tracking** — Input the actual quantity bought and the price per item; the app automatically deducts from your budget as you shop.

---

## 🛠 Tech Stack

- **Framework:** React (Vite)
- **Styling:** CSS / Tailwind
- **Data Source:** REST API (shared with mobile version)
- **Language:** TypeScript / TSX

---

## 🚀 Setup & Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

---

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/Just-Pyro/ShopPlanr-ts.git
cd shopplanr-ts
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the API**

Serve the Blade Version:

```bash
php artisan serve
```

> Please look up the Blade version for setup and installation [ShopPlanr - Blade](https://github.com/Just-Pyro/Shopplanr)

**4. Start the development server**

```bash
npm run dev
```

**5. Open in your browser**

Visit [http://localhost:5173](http://localhost:5173) (or whichever port Vite assigns).

---

### Build for Production

```bash
npm run build
```

The compiled output will be in the `dist/` folder, ready to be deployed.

---

## 📁 Project Structure

```
shopplanr-web/
├── src/
│   ├── pages/        # Page-level components
│   ├── components/   # Reusable UI components
│   ├── services/     # API call functions
│   └── main.tsx      # Entry point
├── public/           # Static assets
```

---

## 🔗 Related Repositories

- [ShopPlanr — Expo Mobile](https://github.com/Just-Pyro/shopplanr-expo101)
- [ShopPlanr — Laravel Blade](https://github.com/Just-Pyro/Shopplanr)
- [ShopPlanr — React Web](https://github.com/Just-Pyro/Shopplanr-web)

---

## 📄 License

This project is for portfolio purposes.
