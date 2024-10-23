# Assignmentfloww
# Personal Expense Tracker API

## Endpoints

### Transactions

- `POST /transactions`
  - **Request Body**: `{ "type": "income" | "expense", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }`
  - **Response**: `{ "id": number }`

- `GET /transactions`
  - **Response**: `[{ "id": number, "type": "string", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }]`

- `GET /transactions/:id`
  - **Response**: `{ "id": number, "type": "string", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }`

- `PUT /transactions/:id`
  - **Request Body**: Same as POST
  - **Response**: `{ "updatedID": number }`

- `DELETE /transactions/:id`
  - **Response**: `{ "deletedID": number }`

- `GET /summary`
  - **Response**: `{ "total_income": number, "total_expenses": number, "balance": number }`

### Categories

- `POST /categories`
  - **Request Body**: `{ "name": "string", "type": "income" | "expense" }`
  - **Response**: `{ "id": number }`

- `GET /categories`
  - **Response**: `[{ "id": number, "name": "string", "type": "string" }]`
