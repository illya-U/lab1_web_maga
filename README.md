# Currency Exchange Web Application

This project is a web application for currency conversion, developed as part of the "Web Application Development Technologies" and "User Interface Programming" courses.

## 🚀 Features

- **User Authentication**: Register, log in, and log out.
- **Currency Conversion**: Select currency, input amount, and get the result.
- **Transaction History**: View balance and the last five transactions.

## 🛠️ Technologies

- **Frontend**: React + Vite
- **Backend**: Django REST Framework
- **Exchange Rates API**: Integrated with an external service (OpenAPI 3.0.3)

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
```

### 3. Frontend Setup

```bash
cd ../../front_end/lab1
npm install
npm run dev
```

## 🌐 Usage

- Open your browser and go to `http://localhost:3000`
- Register or log in
- Perform currency conversions
- Monitor your balance and recent transactions

## 📡 API Endpoints

| Method | URL                         | Description                                |
|--------|-----------------------------|--------------------------------------------|
| POST   | `/exchanger/login/`         | User login, returns a token                |
| POST   | `/exchanger/register/`      | Register a new user                        |
| GET    | `/exchanger/balance/`       | Get the current user balance               |
| GET    | `/exchanger/transactions/`  | Get the latest 5 transactions              |
| POST   | `/exchanger/convert/`       | Convert currency (requires amount & types) |

## 🤝 Contributing

Pull requests are welcome! Fork the repository and submit your improvements.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
