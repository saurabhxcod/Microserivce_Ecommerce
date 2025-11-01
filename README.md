# 🛒 Microservice E-Commerce Backend

A **scalable, modular, and production-grade backend** for an **E-Commerce platform** built using **Microservices Architecture**.  
Each service is isolated, containerized with **Docker**, communicates via **Redis Pub/Sub**, and is secured using **JWT Authentication**.

---

## ⚙️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Language** | Node.js (Express.js) |
| **Database** | MongoDB |
| **Caching / Messaging** | Redis |
| **Authentication** | JWT (JSON Web Token) |
| **Logging** | Winston / Morgan |
| **Containerization** | Docker & Docker Compose |
| **API Gateway** | Nginx / Express Gateway (optional) |

---

## 🧩 Microservices Overview

| Service | Description | Port | Database |
|----------|--------------|------|-----------|
| 🧑‍💼 **Auth Service** | Handles user registration, login, JWT authentication | `5001` | MongoDB |
| 🛍️ **Product Service** | Manages product listing, categories, and inventory | `5002` | MongoDB |
| 💰 **Order Service** | Handles order creation, cart, and tracking | `5003` | MongoDB |
| 🧾 **Logger Service** | Centralized log manager for all microservices | `5004` | Redis |
| 📬 **Notification Service** | Optional — can send email/SMS updates | `5005` | Redis |

---

## 🏗️ System Architecture

```mermaid
graph LR
A[Client / Frontend] --> B[API Gateway]
B --> C1[Auth Service]
B --> C2[Product Service]
B --> C3[Order Service]
C1 --> D[(MongoDB)]
C2 --> D
C3 --> D
C1 -.-> E[Redis Pub/Sub]
C2 -.-> E
C3 -.-> E
E --> F[Logger Service]
