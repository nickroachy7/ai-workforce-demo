# User Management API

A REST API for managing users with full CRUD operations built with Express.js.

## Features

- ✅ Get all users
- ✅ Get user by ID
- ✅ Create new user
- ✅ Update existing user
- ✅ Delete user
- ✅ Input validation and sanitization
- ✅ Error handling
- ✅ CORS support

## API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get user by ID | - |
| POST | `/users` | Create new user | `{ name, email }` |
| PUT | `/users/:id` | Update user | `{ name, email }` |
| DELETE | `/users/:id` | Delete user | - |

### Health Check
- GET `/health` - API health status

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Usage Examples

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "johnsmith@example.com"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Data Model

```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z" // Only present after updates
}
```

## Validation Rules

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format, unique
- **ID**: Must be a valid integer

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment mode |

## Development

```bash
# Install dependencies
npm install

# Start with nodemon for auto-restart
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Production Considerations

This implementation uses in-memory storage for simplicity. For production use:

1. Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. Add authentication and authorization
3. Implement rate limiting
4. Add comprehensive logging
5. Use environment variables for configuration
6. Add data persistence
7. Implement proper error logging and monitoring

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |