# 📬 Currency Exchange Web Application — Async Tasks Edition

This project is a full-featured web application for currency conversion and real-time task monitoring. It includes authentication, async processing with Celery, WebSocket-powered dashboards, and a React-based admin interface.

Developed for the courses:  
**"Web Application Development Technologies"**  
**"User Interface Programming"**

---

## 📄 Report

- 📁 **Backend Report:** [Google Docs](https://docs.google.com/document/d/1Zi8eypy3DLdGIKaP0_qUljpHj2DTBSxUjQf4H7ksrZk/edit?tab=t.0)
- 👤 **Author:** Illia Ustymenko, KV-41mp  
  Computational and graphic project:  
  _"Організація асинхронних задач у веб-застосунках"_

---

## 🚀 Features

- 🔐 **User Authentication:** Register / Login / Logout with Token-based auth
- 💱 **Currency Conversion:** Convert currency with balance deduction
- 📊 **Transaction History:** See last 5 operations per user
- 📡 **Real-Time Updates:**
  - User's transaction list updates live via WebSocket  
  - Admin sees online users live via WebSocket
- 📨 **Async Email Sending:** Welcome email triggered via Celery task
- ⏳ **Long-running Task Queue:** Emulates heavy logic with status tracking
- 🧠 **Admin WebSocket Panel:**
  - Real-time monitoring of all background email and logic tasks
  - Built with **React + Vite**
  - Tasks are color-coded by status (`queued`, `started`, `success`, `error`)

---

## 🛠️ Tech Stack

| Layer        | Technology                             |
|--------------|----------------------------------------|
| **Frontend** | React + Vite + TailwindCSS             |
| **Backend**  | Django REST Framework + Channels       |
| **Async**    | Celery + Redis                         |
| **Auth**     | DRF Tokens                             |
| **Docs**     | DRF Spectacular (Swagger / ReDoc)      |
| **Deployment** | Docker Compose                       |

---

## 💻 Admin React Panel

A dedicated WebSocket-powered **admin interface** was created in the frontend.  
It shows:

- All running and completed **email sending tasks**
- Simulated **long tasks** (via `send_task`)  
- Real-time updates via `ws://<your-backend-host>/ws/email-status/` and `ws://<your-backend-host>/ws/task_status/`
- ✅ Colored table with:  
  `Name`, `Execution time`, `Status`, `End time`

---

## 🔥 New Feature: Async Logic Task API

You can now create long-running tasks using:

```http
POST /exchanger/long_task/
Content-Type: application/json
Authorization: Token <your-token>

{
  "name": "long_work",
  "execution_time": 10
}
```

Each task is queued via Celery, and updates are pushed via WebSocket to `ws://<your-backend-host>/ws/task_status/`.

---

## 🐟 Docker Quickstart

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.queues.yml up --build
```

To shut it down:

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.queues.yml down
```

---

## 🌐 Frontend (Standalone Dev Mode)

```bash
cd front_end/lab1
npm install
npm run dev
```

---

## 🧪 Usage

1. Visit `http://<your-frontend-host>:3000`
2. Register or Login
3. Convert currency, check balance and history
4. Trigger long tasks or email sending
5. Admins can view task dashboards in real-time

---

## 📡 WebSocket API

### 👤 Online Users

- **URL:** `ws://<your-backend-host>/ws/online/`
- **Who:** Admin only
- **Message Type:** `{"online_users": [...]}`

---

### ↺ User Transactions

- **URL:** `ws://<your-backend-host>/ws/transactions/`
- **Who:** Logged-in users
- **Auth:** Token in query string
- **Message:** Live updates when transactions change

---

### 📨 Email Task Status (Admin Only)

- **URL:** `ws://<your-backend-host>/ws/email-status/`
- **Auth:** Token (admin only)
- **Message Types:**
  ```json
  {
    "type": "initial_statuses",
    "tasks": [{ "task_id": "...", "status": "...", "email": "..." }]
  }
  ```
  **Live Task Updates:**
  ```json
  { "task_id": "...", "status": "queued | started | success | error", "email": "..." }
  ```

---

### ⏑ Long Task Status (Admin Only)

- **URL:** `ws://<your-backend-host>/ws/task_status/`
- **Message Types:**
  ```json
  {
    "type": "initial_statuses",
    "tasks": [{ "task_id": "...", "status": "...", "name": "...", "execution_time": ..., "end_time": "..." }]
  }
  ```
  **Live Task Updates:**
  ```json
  { "task_id": "...", "status": "queued | started | success | error", "name": "...", "execution_time": ..., "end_time": "..." }
  ```

---

## 📆 REST API Summary

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| POST   | `/exchanger/register/`        | Register new user and send email  |
| POST   | `/exchanger/login/`           | User login, returns token         |
| POST   | `/exchanger/logout/`          | Invalidate auth token             |
| GET    | `/exchanger/balance/`         | Check balance                     |
| POST   | `/exchanger/convert/`         | Convert currency                  |
| GET    | `/exchanger/transactions/`    | Get last 5 transactions           |
| POST   | `/exchanger/long_task/`       | Simulate async task (new!)        |

---

## ⚙️ Local Dev (No Docker)

```bash
cd back_end/lab1
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
uvicorn lab1.asgi:application --reload

# Start Celery workers
celery -A lab1.celery worker -Q default --loglevel=info
celery -A lab1.celery worker -Q email_queue --loglevel=info
```

---

## 📁 Docker Overview

Your app uses two `docker-compose` configs:
- `docker-compose.yml`: Redis, Django, Channels, Celery
- `docker-compose.queues.yml`: Separate workers for logic + email queues

Each task type uses a distinct queue:
- `email_queue` → sends email notifications
- `default` → simulates long tasks

Redis is used as:
- Cache (via `django-redis`)
- Celery broker
- WebSocket channel backend (Channels)

---

## 🎯 Bonus: Custom Admin WebSocket Dashboard

- Only visible to admins
- React-based table with task info
- Authenticated via token passed in WebSocket query
- Dynamically updates as tasks complete

---

## 🤝 Contributing

Pull requests welcome!  
Feel free to fork the project, create a branch and open a PR.
