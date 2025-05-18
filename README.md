# Currency Exchange Web Application

This project is a web application for currency conversion, developed as part of the "Web Application Development Technologies" and "User Interface Programming" courses.

## Report 
- **back-end**: https://docs.google.com/document/d/105TsEPHxgEpClYJ7GRB-QpSZSrviQA32SQhvEBYdOP0/edit?tab=t.0

## Made by Illia Ustymenko KV-41mp lab1 Web Application Development Technology/Web Interface Programming

---

## 🚀 Features

- **User Authentication:** Register, log in, and log out.
- **Currency Conversion:** Select currency, input amount, and get the result.
- **Transaction History:** View balance and the last five transactions.
- **Real-time Transactions:** Instantly receive updates on your last 5 transactions in real-time using WebSocket (Django Channels).

---

## 🛠️ Technologies

- **Frontend:** React + Vite
- **Backend:** Django REST Framework + Django Channels (WebSocket)
- **Exchange Rates API:** Integrated with an external service (OpenAPI 3.0.3)

---

## 🔧 Setup

### 1. Clone the repository

```bash
git clone https://github.com/illya-U/lab1_web_maga.git
cd lab1_web_maga
```

### 2. Backend Setup

```bash
cd back_end/lab1
python -m venv venv
```

Activate the virtual environment:

- Windows:
  ```bash
  venv\Scripts\activate
  ```
- macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

Install dependencies and run the server:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# For full websocket support:
uvicorn lab1.asgi:application --reload
```

### 3. Frontend Setup

```bash
cd ../../front_end/lab1
npm install
npm run dev
```

---

## 🌐 Usage

- Open your browser and go to `http://localhost:3000`
- Register or log in
- Perform currency conversions
- Monitor your balance and recent transactions (real-time updates if enabled)
- Option for admin see count of active users

---

## 📡 API Endpoints

| Method | URL                          | Description                                |
|--------|------------------------------|--------------------------------------------|
| POST   | `/exchanger/login/`          | User login, returns a token                |
| POST   | `/exchanger/register/`       | Register a new user                        |
| GET    | `/exchanger/balance/`        | Get the current user balance               |
| GET    | `/exchanger/transactions/`   | Get the latest 5 transactions              |
| POST   | `/exchanger/convert/`        | Convert currency (requires amount & types) |

---

## 🔌 WebSocket Real-time Transactions

- **URL:** `ws://localhost:8000/ws/transactions/`
- **Auth:** Pass your token in the `Authorization` header (`Token <your_token>`)
- **Behavior:** After connecting, you will receive your latest 5 transactions. When you perform a new transaction, the list updates automatically in real time.

#### Example JS WebSocket client

```js
const socket = new WebSocket('ws://localhost:8000/ws/transactions/');

socket.onopen = () => {
  socket.send(JSON.stringify({})); // Optionally trigger sending transactions
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Latest transactions:', data.transactions);
};
```
> **Note:** For authenticated access, you may need a custom WebSocket client that sends the token as a header, or use a middleware that reads the token from a query parameter.

---

## 🤝 Contributing

Pull requests are welcome! Fork the repository and submit your improvements.