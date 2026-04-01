# Finance Data Processing and Access Control Dashboard API

This project is a robust backend API designed for managing financial records and providing dashboard analytics with a strong emphasis on role-based access control (RBAC). It's built with Node.js, Express.js, and MongoDB (Mongoose), featuring JWT authentication, Joi validation, and a clean, maintainable service-layer architecture.

## Project Overview

The API serves as the backbone for a financial dashboard application, allowing users with different roles to manage financial records (income/expenses) and view aggregated analytics. It's structured to be easily understandable, extendable, and production-ready, making it an ideal candidate for an internship screening evaluation.

## Architecture Explanation

The project follows a layered architecture pattern, promoting separation of concerns and maintainability:

1.  **Routes Layer**: Defines API endpoints and maps them to specific controller functions. It's kept thin, focusing solely on routing.
2.  **Controllers Layer**: Handles incoming requests, extracts data, calls the appropriate service methods, and sends back structured JSON responses. Controllers are intentionally kept thin, delegating business logic to services.
3.  **Services Layer**: Contains the core business logic. This includes interacting with the database (via Mongoose models), performing calculations, applying filtering/pagination, and implementing complex operations like analytics aggregations.
4.  **Models Layer**: Defines the Mongoose schemas for MongoDB collections, representing the data structure and relationships.
5.  **Middleware Layer**: Houses reusable functions for authentication (JWT verification), authorization (role-based checks), and request validation (Joi schemas). This ensures security and data integrity are applied consistently across relevant routes.
6.  **Validators Layer**: Stores Joi schemas used by the validation middleware to ensure incoming request data adheres to predefined rules.
7.  **Config Layer**: Manages environment variables and application-wide configurations.
8.  **Utils Layer**: Contains utility functions, custom error classes, and API response helpers to standardize common operations and error handling.

This structure ensures that each part of the application has a single responsibility, making the codebase easier to navigate, test, and scale.

## Folder Structure Explanation

```
.
├── src/
│   ├── config/             # Environment variables and application settings
│   │   └── index.js
│   ├── controllers/        # Request handlers, orchestrate service calls
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── record.controller.js
│   │   └── user.controller.js
│   ├── middleware/         # Express middleware for auth, authorization, validation
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── error.js
│   │   └── validate.js
│   ├── models/             # Mongoose schemas for database entities
│   │   ├── FinancialRecord.js
│   │   └── User.js
│   ├── routes/             # API endpoint definitions
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── index.js        # Central route aggregator
│   │   ├── record.routes.js
│   │   └── user.routes.js
│   ├── services/           # Core business logic and database interactions
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── record.service.js
│   │   └── user.service.js
│   ├── utils/              # Utility functions, custom errors, API response helpers
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── catchAsync.js
│   │   └── constants.js
│   └── validators/         # Joi schemas for request body validation
│       ├── auth.validator.js
│       ├── record.validator.js
│       └── user.validator.js
├── .env.example            # Example environment variables
├── app.js                  # Express application setup and middleware
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── server.js               # Database connection and server startup
```

## Database Schema Reasoning

### User Model

The `User` model captures essential user information and their role within the system.

*   `name`: User's full name.
*   `email`: Unique identifier for login, used for communication.
*   `password`: Hashed password for security.
*   `role`: Defines access permissions (`viewer`, `analyst`, `admin`). Crucial for RBAC.
*   `status`: Indicates if the user account is active or inactive, allowing for soft disabling of accounts.
*   `createdAt`: Timestamp for when the user was created.

### FinancialRecord Model

The `FinancialRecord` model stores individual financial transactions.

*   `amount`: The monetary value of the transaction. Must be positive.
*   `type`: Categorizes the transaction as `income` or `expense`.
*   `category`: A descriptive category (e.g., "Salary", "Groceries", "Rent") for filtering and analytics.
*   `date`: The date of the transaction, important for time-based analytics.
*   `note`: Optional descriptive text for the record.
*   `createdBy`: References the `User` who created the record, useful for auditing and multi-user environments.
*   `isDeleted`: A boolean flag for soft deletion. Instead of permanently removing records, they are marked as deleted, preserving historical data for potential recovery or auditing.
*   `timestamps`: Mongoose option to automatically add `createdAt` and `updatedAt` fields.

## Role-Permission Matrix

This matrix outlines the capabilities of each role within the system.

| Feature / Role      | `viewer` (Read-Only) | `analyst` (Read + Analytics) | `admin` (Full Access) |
| :------------------ | :------------------- | :--------------------------- | :-------------------- |
| **User Management** |                      |                              |                       |
| List Users          | ❌                   | ❌                           | ✅                    |
| Update User Status  | ❌                   | ❌                           | ✅                    |
| Update User Role    | ❌                   | ❌                           | ✅                    |
| **Record Management** |                      |                              |                       |
| Create Record       | ❌                   | ❌                           | ✅                    |
| List Records        | ❌                   | ✅                           | ✅                    |
| Get Single Record   | ❌                   | ✅                           | ✅                    |
| Update Record       | ❌                   | ❌                           | ✅                    |
| Delete Record       | ❌                   | ❌                           | ✅ (Soft Delete)      |
| **Dashboard/Analytics** |                      |                              |                       |
| Dashboard Summary   | ✅                   | ✅                           | ✅                    |
| Category Breakdown  | ❌                   | ✅                           | ✅                    |
| Monthly Trends      | ❌                   | ✅                           | ✅                    |
| Recent Transactions | ❌                   | ✅                           | ✅                    |

## API Endpoint Table

| Method | Endpoint                               | Description                                     | Authentication | Authorization |
| :----- | :------------------------------------- | :---------------------------------------------- | :------------- | :------------ |
| `POST` | `/api/auth/register`                   | Register a new user                             | None           | None          |
| `POST` | `/api/auth/login`                      | Log in a user and get JWT token                 | None           | None          |
| `GET`  | `/api/users`                           | List all users                                  | Required       | `admin`       |
| `PATCH`| `/api/users/:id/status`                | Update a user's status (`active`/`inactive`)    | Required       | `admin`       |
| `PATCH`| `/api/users/:id/role`                  | Update a user's role (`viewer`/`analyst`/`admin`)| Required       | `admin`       |
| `POST` | `/api/records`                         | Create a new financial record                   | Required       | `admin`       |
| `GET`  | `/api/records`                         | List financial records (with filters/pagination)| Required       | `analyst`, `admin` |
| `GET`  | `/api/records/:id`                     | Get a single financial record by ID             | Required       | `analyst`, `admin` |
| `PATCH`| `/api/records/:id`                     | Update a financial record by ID                 | Required       | `admin`       |
| `DELETE`| `/api/records/:id`                     | Soft delete a financial record by ID            | Required       | `admin`       |
| `GET`  | `/api/dashboard/summary`               | Get total income, expenses, net balance         | Required       | `viewer`, `analyst`, `admin` |
| `GET`  | `/api/dashboard/category-breakdown`    | Get income/expense totals by category           | Required       | `analyst`, `admin` |
| `GET`  | `/api/dashboard/monthly-trends`        | Get monthly income/expense trends               | Required       | `analyst`, `admin` |
| `GET`  | `/api/dashboard/recent-transactions`   | Get a list of recent transactions               | Required       | `analyst`, `admin` |

**Pagination Support:**
For `/api/records` and `/api/dashboard/recent-transactions`, use query parameters:
*   `?page=1` (default: 1)
*   `?limit=10` (default: 10)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd finance-dashboard-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `.env.example`.
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/finance_dashboard
    JWT_SECRET=your_strong_jwt_secret_key_here
    ```
    *   `PORT`: The port your server will run on.
    *   `MONGO_URI`: Your MongoDB connection string. Ensure MongoDB is running.
    *   `JWT_SECRET`: A strong, random string for signing JWTs.
4.  **Start the server:**
    ```bash
    npm start
    # or for development with nodemon (if installed globally)
    # npm run dev
    ```
    The API will be running at `http://localhost:PORT`.

## Environment Variables

*   `PORT`: The port number for the Express server (e.g., `3000`).
*   `MONGO_URI`: The connection string for your MongoDB database.
*   `JWT_SECRET`: A secret key used to sign and verify JSON Web Tokens. **Keep this secure and never expose it.**

## Example API Responses

### Successful Response Structure

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "60c72b2f9b1e8b001c8e4d1a",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "viewer",
    "status": "active",
    "createdAt": "2023-10-26T10:00:00.000Z"
  }
}
```

### Error Response Structure

```json
{
  "success": false,
  "message": "Invalid email or password.",
  "statusCode": 401
}
```

```json
{
  "success": false,
  "message": "Validation failed: \"email\" must be a valid email.",
  "statusCode": 400
}
```

## Assumptions Made

1.  **MongoDB Availability**: It's assumed that a MongoDB instance is running and accessible via the `MONGO_URI` provided in the `.env` file.
2.  **Single Database**: The project uses a single MongoDB database for all data models.
3.  **JWT as Sole Authentication Method**: JWTs are the only mechanism for authenticating API requests.
4.  **No Password Reset/Email Verification**: For simplicity in an assessment, features like password reset flows or email verification are not included.
5.  **Soft Delete for Records**: Financial records are only soft-deleted (`isDeleted: true`) and not permanently removed from the database. This preserves historical data.
6.  **No Frontend**: This project is purely a backend API; no frontend application is provided or assumed to be part of this submission.
7.  **Basic User Status/Role Management**: User status and role changes are handled directly via API endpoints, without complex approval workflows.

## Design Tradeoffs

1.  **No TypeScript**: While TypeScript offers significant benefits for larger projects (type safety, better tooling), it was explicitly excluded as per requirements to keep the project lean and focused on core JavaScript for an internship evaluation. This means less compile-time error checking.
2.  **Minimal External Libraries**: The project uses only essential libraries (Express, Mongoose, Joi, JWT, Bcrypt, Dotenv). This avoids "framework bloat" but means some common utilities (e.g., advanced logging, caching) are not pre-integrated.
3.  **Simplified Error Handling**: A custom `ApiError` class and a global error middleware are used for structured error responses. For extremely complex applications, a more sophisticated error reporting/logging system might be beneficial.
4.  **No Caching Layer**: To keep the project focused, no caching mechanism (e.g., Redis) is implemented. For high-traffic analytics endpoints, a caching layer would significantly improve performance.
5.  **Direct Mongoose Aggregations**: Analytics endpoints directly use Mongoose's aggregation pipeline. While powerful, for very complex, dynamic reporting, a dedicated analytics service or data warehouse might be considered in a larger system.
6.  **No Rate Limiting**: To avoid over-engineering for this assessment, rate limiting middleware is not included. In a production environment, this would be crucial for security and preventing abuse.

## Future Improvements

1.  **Comprehensive Logging**: Implement a robust logging system (e.g., Winston, Pino) for better debugging, monitoring, and auditing.
2.  **Rate Limiting**: Add rate limiting to protect against brute-force attacks and API abuse.
3.  **Input Sanitization**: Implement more rigorous input sanitization to prevent XSS and injection attacks, especially for `note` fields.
4.  **Advanced Filtering & Sorting**: Extend filtering capabilities for records and users (e.g., sort by date, amount, name).
5.  **Caching**: Introduce a caching layer (e.g., Redis) for frequently accessed data, especially dashboard analytics, to improve response times.
6.  **Pagination for All Lists**: Ensure all list endpoints (e.g., `/users`) support pagination.
7.  **Password Reset & Email Verification**: Implement secure password reset flows and email verification for enhanced user security.
8.  **Unit and Integration Tests**: Add comprehensive test suites using frameworks like Jest or Mocha to ensure reliability and prevent regressions.
9.  **Dockerization**: Provide Dockerfiles and Docker Compose configurations for easier deployment and environment consistency.
10. **API Documentation**: Integrate Swagger/OpenAPI for interactive API documentation.
11. **Environment-specific Configurations**: Enhance the `config` module to handle different environments (development, staging, production) more robustly.
