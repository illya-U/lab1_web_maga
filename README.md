# Project: Currency Exchange Website

## Description

This project is a web application for currency conversion. Users can log in, view their balance, and check the last 5 transactions. The project uses the following technologies:

- **Frontend:** React, Vite
- **Backend:** Django (API)
- **API:** Exchanger API (OpenAPI 3.0.3)

## Functionality

1. **Authentication and Registration**
    - Users can log in, register, and log out.
    - Authentication is done via a token passed in the `Authorization` header.

2. **Currency Conversion**
    - Users can select currencies, enter an amount, and get the conversion result.
    - Each conversion operation is recorded as a transaction.

3. **Viewing Balance and Transactions**
    - Users can view their balance and the last 5 transactions.

## API

The project uses the Exchanger API, the definition of which is provided below.

### Endpoints

- **POST /exchanger/login/**  
  User login. Returns a token for subsequent requests.

- **POST /exchanger/logout/**  
  Logs the user out.

- **POST /exchanger/register/**  
  User registration.

- **GET /exchanger/users/**  
  Get the list of users.

- **GET /exchanger/users/{id}/**  
  Get user information by their ID.

- **POST /exchanger/users/add_transaction/**  
  Add a transaction.

- **GET /exchanger/users/transactions/**  
  Get the list of the user’s transactions.

### Schemas

- **User**
  - `id` (integer) - User ID.
  - `username` (string) - User's name.
  - `email` (string) - User's email.
  - `gender` (string) - User's gender.
  - `birth_date` (string) - User's birth date.
  - `transactions` (array) - List of transactions.

- **Transaction**
  - `amount` (string) - Transaction amount.
  - `from_currency` (string) - Currency being exchanged from.
  - `to_currency` (string) - Currency being exchanged to.
  - `timestamp` (string) - Transaction timestamp.

## Setup Instructions

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/exchanger.git
    ```

2. Navigate to the project directory:

    ```bash
    cd exchanger
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the project:

    ```bash
    npm run dev
    ```

### Configuration

For the project to work correctly, you need to configure the environment variables.

Create a `.env` file in the root of the project and add the following lines:

VITE_EXCHANGER_API_HUB_KEY=your_api_key VITE_DJANGO_HOST=http://your-django-host.com

## Project Structure

. ├── src/ │ ├── components/ │ │ ├── Exchanger.jsx # Currency exchange component │ │ ├── AboutApp.jsx # Application description │ │ └── ... │ ├── common/ │ │ └── AuthService.jsx # Service for authentication │ ├── App.jsx # Main component │ └── index.js # Entry point ├── public/ │ └── index.html ├── package.json └── .env # Environment variables


## Technologies Used

- **React** — For building the user interface.
- **Vite** — For fast bundling and development.
- **Django** — For the backend, handling API requests.
- **Exchanger API** — External API for currency exchange.

## Notes

- The application uses the Exchanger API to get currency exchange rates.
- All requests are authenticated via a token, which must be passed in the header of each request.
- The interface includes a feature to view the user's last 5 transactions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
