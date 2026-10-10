<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Dumbbell.svg" alt="Gym-Tracker-AI Logo" width="100" />

  # Gym Tracker AI

  **AI-Powered Modern Gym Management & Member Retention System**

  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](#)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](#)
  [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](#)

  [Quick Start](#getting-started) • [Features](#key-features) • [Architecture](#architecture--design-patterns)

</div>

---

Gym Tracker AI is a full-stack web application built with **Next.js** and **Express/Prisma**, designed for gym owners, trainers, and athletes. Leveraging Google Gemini AI integration, it analyzes member attendance patterns alongside detailed profile and program data, calculates churn risks, and generates tailored coaching insights for trainers.

## Key Features

- **AI-Driven Risk Analytics (Powered by Gemini AI)**
  - Analyzes member attendance frequencies, average gap days, and last visit timelines.
  - Automatically identifies at-risk ("Ghost") members who show signs of dropping out.
  - Generates actionable coaching strategies for trainers along with personalized, friendly, and non-intrusive re-engagement message templates (email, SMS, WhatsApp) tailored to member goals.

- **Real-Time Session & QR Check-in Management**
  - Tracks member check-ins and check-outs seamlessly in real time.
  - Displays live active session dashboards with instant status indicators.
  - Efficiently handles large-scale historical session data using backend pagination and responsive UI tables.

- **Advanced Member & Trainer Management**
  - Comprehensive tracking of member fitness goals, active program packages, and measurement metrics.
  - Member-trainer assignment workflows with dedicated evaluation and note-taking interfaces.

- **Modern & Responsive UI/UX**
  - Crafted with an optimized Tailwind CSS architecture utilizing custom dynamic CSS variables (`var(--nav-bg)`).
  - Designed with robust loading states, error boundaries, and data-dense tables to ensure a smooth user experience.

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Library:** [React](https://react.dev/) (TypeScript)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) (AsyncThunks, Feature-based Slices)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom CSS Variables, Responsive Design)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Validation:** [Zod](https://zod.dev/)
- **Security & Rate Limiting:** Helmet, `express-rate-limit`
- **Logging:** Winston (File-based transports) & Morgan (HTTP request logging)

### Database & ORM
- **Database:** MySQL
- **ORM:** [Prisma](https://www.prisma.io/) (Migrations, Transactions, Relations)

### DevOps, Deployment & Infrastructure
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Reverse Proxy & Web Server:** [Nginx](https://www.nginx.com/)

### Artificial Intelligence & Testing
- **AI Integration:** Google Gemini AI API (`@google/genai`, Gemini 2.5 Flash)
- **Testing:** Jest, Supertest, ts-jest (Unit & Integration Tests)

## Architecture & Design Patterns

The project follows a rigorous, scalable architecture designed to handle complex business logic while maintaining clean separation of concerns:

- **Feature-Based Folder Structure (Frontend):** 
  The codebase is modularized by features rather than file types, ensuring high cohesion and low coupling across components, state slices, and views.
- **Container/View Pattern:** 
  UI components are strictly decoupled into **Containers** (handling business logic, Redux state dispatching, and side effects) and **Views** (pure, stateless presentation components).
- **Controller-Service Architecture (Backend):** 
  Express backend separates request handling (`Controllers`) from core business and database operations (`Services`), keeping routes clean and testable.
- **Robust Error Handling & Logging:** 
  Centralized custom error-handling middleware coupled with structured Winston file transports and Morgan HTTP request streams.
- **Type-Safe Data Flow:** 
  End-to-end type safety enforced via TypeScript interfaces, Prisma schemas, and Zod runtime payload validations.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) server running locally or via Docker
- [Docker & Docker Compose](https://www.docker.com/) (Optional, for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/hasanbelen35/gym-tracker-AI.git
cd gym-tracker-AI
```

### 2. Backend Setup

Create a `.env` file in the backend directory and configure the following environment variables:

```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your_secure_jwt_secret_key"
COOKIE_MAX_AGE=604800000
CLIENT_URL="http://localhost:3000"
GITHUB_EXERCISE_DATA="https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/"
NODE_ENV="dev"
GEMINI_API_KEY="your_google_gemini_api_key"
```

Install dependencies, run the Prisma migrations to set up the database schema, and start the backend server:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup

Create a `.env` file in the frontend directory:

```env
SERVER_API_URL=http://localhost:5000/api
JWT_SECRET="your_secure_jwt_secret_key"
```

Install dependencies and run the Next.js development client:

```bash
cd frontend
npm install
npm run dev
```

## Screenshots

| Gym Dashboard | Member Profile |
| :---: | :---: |
| ![Gym Dashboard](./assets/gym-dashboard.png) | ![Member Profile](./assets/member-profile.png) |

| Assignment Center | Trainer Panel |
| :---: | :---: |
| ![Assignment Center](./assets/assignment-center.png) | ![Trainer Panel](./assets/trainer-panel.png) |

| Exercise Pool | Exercise Detail |
| :---: | :---: |
| ![Exercise Pool](./assets/exercise-pool.png) | ![Exercise Detail](./assets/exercise-detail.png) |

| Sessions Pool | Workout Step 1 |
| :---: | :---: |
| ![Sessions Pool](./assets/sessions-pool.png) | ![Workout Step 1](./assets/workout-step-1.png) |

| Sets & Performance |
| :---: |
| ![Sets](./assets/sets.png) |

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.