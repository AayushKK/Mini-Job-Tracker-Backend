# 📋 Job Tracker API

A RESTful API for tracking job applications built with Node.js, Express, and PostgreSQL (Neon). This API allows users to manage their job applications with full CRUD operations, filtering, search, and statistics.

---

## 📸 Screenshots

### 🧪 Jest Test Results

![Jest Test Results](./screenshots/jest_test.png)
*All tests passing with coverage report*

### 📬 Postman API Testing

![Postman GET Request](./screenshots/Postman_test-GET_REQUEST.png)
*Getting all applications from the API*

![Postman POST Request](./screenshots/Postman_test-POST_REQUEST.png)
*Creating a new application successfully*

---

## 📌 Project Overview

The Job Tracker API is a robust backend service that helps users organize and track their job applications. It provides endpoints to:

- ✅ Create new job applications
- ✅ Retrieve all applications with optional filtering
- ✅ Retrieve individual application details
- ✅ Update application status and details
- ✅ Delete applications
- ✅ Get application statistics (total, by status)

### Key Features

- **Search & Filter**: Search by company name or job title, filter by status
- **UUID Primary Keys**: Secure, globally unique identifiers
- **PostgreSQL with Neon**: Cloud-hosted database with automatic backups
- **MVC Architecture**: Clean separation of concerns
- **Comprehensive Error Handling**: Custom error classes with proper HTTP status codes
- **Input Validation**: Zod-like validation for all inputs
- **Input Sanitization**: XSS protection and data cleaning
- **Database Migrations**: Version-controlled schema changes
- **Unit Tests**: Jest tests with 60%+ coverage
- **ES Module Support**: Modern JavaScript with import/export

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | JavaScript runtime |
| **Express.js** | 5.x | Web framework |
| **PostgreSQL** | 15+ | Relational database |
| **Neon** | - | Cloud PostgreSQL hosting |
| **pg** | 8.x | PostgreSQL client |
| **dotenv** | 16.x | Environment variables |
| **cors** | 2.x | Cross-origin resource sharing |

### Development & Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| **Nodemon** | 3.x | Auto-restart server during development |
| **Jest** | 29.x | Testing framework |
| **Supertest** | 6.x | HTTP assertion library |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v15 or higher) or [Neon](https://neon.tech/) account
- [Git](https://git-scm.com/) (for cloning the repository)

---

# Setup Guide

## How to Run in Development Mode

```bash
# 1. Clone and install
git clone https://github.com/AayushKK/Mini-Job-Tracker-Backend.git
cd Mini-Job-Tracker-Backend
npm install

# 2. Set up environment variables (see below)
cp .env.example .env

# 3. Run database migrations
npm run migrate:up

# 4. Start development server
npm run dev
```

Server will run at `http://localhost:5000` with auto-restart on changes.

---

## How to Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run in watch mode (auto-rerun on changes)
npm test -- --watch

# Run a specific test file
npm test -- tests/app.test.js
```

**Expected Output:**
```
 PASS  tests/app.test.js
  Job Tracker API Tests
    ✓ GET /api/health (37 ms)
    ✓ GET /api/applications (852 ms)
    ✓ POST /api/applications (226 ms)
    ✓ GET /api/applications?status=Applied (90 ms)
    ✓ GET /api/applications/invalid-uuid (26 ms)
    ✓ GET /api/applications/non-existent-uuid (145 ms)
    ✓ DELETE /api/applications/:id (393 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

---

## Required Environment Variables

Create a `.env` file with:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** |

---

## .env.example

Create `.env.example` to share with others:

```env
# Server
PORT=5000

# Database (Option 1: Connection String - Recommended)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Database (Option 2: Individual Variables - Local)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=jobtracker

# Environment
NODE_ENV=development
```

**Note:** Never commit `.env` to Git. Always use `.env.example` to share structure without secrets.

---

## Job Tracker API Documentation

**Base URL:** `http://localhost:5000/api`

---

## GET /health
Health check.

**Response:**
```json
{ "status": "OK", "timestamp": "2026-06-19T10:30:00.000Z", "uptime": 123.45 }
```

---

## GET /applications
Get all applications with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Applied, Interviewing, Offer, Rejected |
| `search` | string | Search by company or job title |

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "company_name": "Google",
      "job_title": "Software Engineer",
      "job_type": "Full-time",
      "status": "Applied",
      "applied_date": "2026-06-15",
      "notes": "Excited!",
      "created_at": "2026-06-19T10:30:00.000Z",
      "updated_at": "2026-06-19T10:30:00.000Z"
    }
  ]
}
```

---

## GET /applications/:id
Get a single application by UUID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Application ID |

**Response:** Same as above.

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid ID format. Must be a valid UUID |
| 404 | Application not found |

---

## POST /applications
Create a new application.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company_name` | string | ✅ | 2-255 chars |
| `job_title` | string | ✅ | 1-255 chars |
| `job_type` | enum | ✅ | Internship, Full-time, Part-time |
| `status` | enum | ✅ | Applied, Interviewing, Offer, Rejected |
| `applied_date` | date | ✅ | YYYY-MM-DD |
| `notes` | string | ❌ | Max 1000 chars |

**Example:**
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Google","job_title":"Software Engineer","job_type":"Full-time","status":"Applied","applied_date":"2026-06-15"}'
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "...", "company_name": "Google", ... }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Missing required fields: ... |
| 400 | Invalid job_type. Must be: Internship, Full-time, Part-time |
| 400 | Invalid status. Must be: Applied, Interviewing, Offer, Rejected |

---

## PATCH /applications/:id
Update an application (partial update allowed).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Application ID |

**Request Body:** Any fields from POST.

**Example:**
```bash
curl -X PATCH http://localhost:5000/api/applications/550e8400... \
  -H "Content-Type: application/json" \
  -d '{"status":"Interviewing"}'
```

**Response:** Updated application object.

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid ID format. Must be a valid UUID |
| 400 | No fields to update |
| 404 | Application not found |

---

## DELETE /applications/:id
Delete an application.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Application ID |

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/applications/550e8400...
```

**Response:**
```json
{ "success": true, "message": "Application deleted successfully" }
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid ID format. Must be a valid UUID |
| 404 | Application not found |

---

## GET /applications/stats
Get application statistics.

**Example:**
```bash
curl http://localhost:5000/api/applications/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": "5",
    "applied": "2",
    "interviewing": "1",
    "offer": "1",
    "rejected": "1"
  }
}
```

---

## Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/applications` | List all (filter: ?status=, ?search=) |
| GET | `/applications/:id` | Get single |
| POST | `/applications` | Create |
| PATCH | `/applications/:id` | Update |
| DELETE | `/applications/:id` | Delete |
| GET | `/applications/stats` | Statistics |

---
