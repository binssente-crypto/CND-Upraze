# CND Upraze Solutions

CND Upraze Solutions is a comprehensive SaaS platform designed to empower businesses with intelligent tools for AI assistance, data forecasting, and more. Our mission is to create smart, scalable systems that adapt to the evolving needs of modern industries.

## System Architecture

Our system is built using a modern micro-monolith approach, containerized with Docker for seamless deployment and scalability.

```mermaid
graph TD
    User((User))
    Nginx[Nginx Reverse Proxy]
    React[React + Vite Frontend]
    Laravel[Laravel 11 Backend]
    Postgres[(PostgreSQL Database)]
    Redis[(Redis Cache)]

    User --> Nginx
    Nginx --> React
    Nginx --> Laravel
    React <--> Laravel
    Laravel <--> Postgres
    Laravel <--> Postgres
    Laravel <--> Redis
```

## Data Pipeline (AI Query Flow)

The following diagram illustrates how an asynchronous AI query or task is handled within the CND Upraze ecosystem.

```mermaid
sequenceDiagram
    participant U as User (React UI)
    participant B as Backend (Laravel)
    participant D as Database (Postgres)
    participant Q as Task Queue
    participant AI as AI Engine

    U->>B: POST /api/features/ai-assistant (Prompt)
    B->>D: Create Conversation Log
    B->>Q: Dispatch Job
    B-->>U: 202 Accepted (Job ID)
    
    Q->>AI: Process with AI Engine
    AI-->>Q: Result Data
    Q->>D: Update Job Status & Content
    
    Note over U,D: Polling or WebSocket Notification
    U->>B: GET /api/features/ai-assistant/status/{id}
    B->>D: Fetch Result
    D-->>B: Content
    B-->>U: Processed Response
```

## Recent Feature Implementations (April 2026)

### Support & Inquiry System
A full-featured communication hub for inquiries and customer support:
- **User Support Center**: Allows users to create inquiry tickets and chat directly with support.
- **Admin Support Inbox**: A centralized dashboard for administrators to manage, reply, and track statuses of all customer inquiries.
- **Threaded Conversations**: Uses JSONB message threads for efficient and scalable chat history management.

### Dashboard Modules Hub
A centralized "Central Hub" for all available business modules:
- **Quick Launch**: One-click access to AI Assistant, Forecasting, and specialized business tools.
- **Modern UI**: High-fidelity cards with dynamic hover effects and status indicators.

### Content Protection & Security
Implementation of strict content security measures:
- **Disabled Copy/Paste**: Global blocking of Ctrl+C and Ctrl+A commands.
- **Text Selection Prevention**: CSS-level select-none implementation across the entire app to prevent unauthorized content extraction.
- **Repository Governance**: Integrated CODEOWNERS and branch protection strategies to enforce Pull Request workflows for collaborators.

### Legal Infrastructure
Branded, professional legal pages accessible via ultra-snappy modals:
- **Privacy Policy & Terms of Service**: High-fidelity modals integrated into the landing page footer and registration flow.
- **Snappy UX**: Optimized 0.15s transition speeds for an "instant" feel.

## 🛠️ Technical Ecosystem

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>


| Category | Technology Stack | Detailed Implementation & Strategic Role |
| :--- | :--- | :--- |
| **Frontend Architecture** | ⚛️ **React 18**, **Vite**, **Tailwind 4.0** | **User Experience Excellence**: CND Upraze prioritizes an "Instant-Feel" interface. We utilize **Framer Motion** with a strict **0.15s spring animation** policy to eliminate perceived latency. **Tailwind CSS 4.0** provides the modern design tokens for our proprietary high-fidelity aesthetic. |
| **Backend Core** | 🐘 **Laravel 11**, **PHP 8.3**, **Sanctum** | **Security & Orchestration**: The backend serves as the **Protocol Core**. We use **Laravel Sanctum** for stateful API authentication, ensuring secure session persistence. **PHP 8.3** features are strictly enforced to maintain a high-performance, robust architecture. |
| **Data Integrity** | 🐘 **PostgreSQL 16**, **JSONB** | **Dynamic Conversational Data**: Our chat and support modules rely on **JSONB** for high-speed indexing of non-structured message threads. This allows for scalable, threaded interactions while maintaining strict relational integrity for enterprise data. |
| **Performance Scaling** | ⚡ **Redis 7**, **Task Queues** | **Asynchronous AI Operations**: To keep the UI non-blocking, all AI-related tasks are dispatched to **Redis-backed background queues**. Redis also handles session caching and rate-limiting to protect the system from traffic spikes. |
| **Payment Gateway** | 💳 **PayMongo** | **Localized Enterprise Payments**: Native integration with **PayMongo** caters specifically to the Philippines market, supporting GCash, Maya, and local bank transfers with real-time webhook synchronization for instant access. |
| **Cloud Infrastructure** | 🐳 **Docker**, **Nginx**, **Actions** | **Reliable Delivery**: The entire stack is containerized with **Docker**, ensuring consistency across environments. **GitHub Actions** automates our CI/CD pipeline, running tests and static analysis before every deployment to our **Nginx** clusters. |





## Getting Started

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/binssente-crypto/CND-Upraze.git
   cd CND-Upraze
   ```

2. **Prepare Environment**:
   Copy the example environment files for both frontend and backend:
   ```bash
   cp backend/.env.example backend/.env
   # Ensure DB_HOST is set to 'postgres' in backend/.env
   ```

3. **Run with Docker**:
   ```bash
   docker compose up -d --build
   ```

4. **Initialize Database**:
   ```bash
   docker compose exec backend php artisan migrate --seed
   ```

The application will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

## Core Modules
- **PROTOCOL CORE**: Our proprietary architectural heart, visualized with a 3D CND loop.
- **ENTERPRISE PRICING**: Scalable subscription tiers for any size of operation.
- **AI ASSISTANCE**: Task automation and intelligent decision support.
- **FORECASTING**: Predictive analytics and trend modeling.
- **IMAGE RECOGNITION**: AI-driven visual data extraction.
- **QR CODE ACCESS**: Fast, proprietary access and activity tracking.
- **SUPPORT CENTER**: Real-time customer inquiry and chat system.

---
© 2026 CND UPRAZE SOLUTIONS. ALL RIGHTS RESERVED.
