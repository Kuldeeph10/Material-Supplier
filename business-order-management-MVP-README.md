# Business Order Management App — MVP

## 1. Project Overview

This project is a simple business order management application for a local construction-material and earthmoving business.

The business receives customer orders mainly through phone calls. The manager currently needs a simple way to record what each customer wants and track whether the order has been completed.

### Business Context

The business provides services/products such as:

- Sand
- Bricks
- Stones / Gitti
- Soil / मिट्टी
- Tractor-based material delivery
- JCB / earthmoving services
- Other related requirements

**Important:** These products/services are only examples for the MVP. The system should allow the manager to enter a custom requirement when needed.

---

## 2. MVP Goal

The MVP has one primary purpose:

> **Record customer orders received by phone and track their completion status.**

The basic workflow is:

```text
Customer calls
      ↓
Manager records requirement
      ↓
Order is created
      ↓
Order remains Pending
      ↓
Business completes the work/delivery
      ↓
Manager marks order Completed
```

The customer does **not** need to use the application in the MVP.

---

## 3. MVP Scope

### Included

- Manager/admin login
- Dashboard
- Create order
- View all orders
- View order details
- Search orders
- Filter orders by status
- Edit an order
- Delete/cancel an order
- Mark order as completed
- View completed orders
- Store customer information
- Store order notes
- Store order creation date/time

### Not Included in MVP

Do **not** build these unless explicitly requested later:

- Online customer registration
- Customer mobile application
- Online payments
- Inventory management
- Accounting
- GST/invoicing
- Profit/loss calculation
- Driver management
- Tractor management
- JCB fleet management
- Employee management
- GPS tracking
- Live delivery tracking
- Push notifications
- Subscription system
- Multi-vendor marketplace
- E-commerce/cart system
- Complex reporting
- AI/RAG features

The MVP must remain small and focused.

---

# 4. Main User

## Manager / Business Admin

The primary user is the person who receives customer calls and records orders.

The manager should be able to:

1. Log in.
2. Create a new customer/order record.
3. Record what the customer needs.
4. See all pending orders.
5. Open an order.
6. Mark the order as completed.
7. Search/filter previous orders.

---

# 5. Order Data

Each order should contain approximately:

| Field | Required | Description |
|---|---|---|
| Order ID | Yes | Unique order identifier |
| Customer Name | Yes | Customer's name |
| Phone Number | Yes | Customer contact number |
| Requirement | Yes | What the customer needs |
| Quantity | No | Quantity if applicable |
| Unit | No | Tractor, load, piece, hour, etc. |
| Delivery/Work Location | No | Customer location |
| Notes | No | Additional information |
| Status | Yes | Pending / Completed / Cancelled |
| Created At | Yes | Order creation date/time |
| Completed At | No | Completion date/time |

The system should support custom requirements instead of limiting the manager to predefined products.

Example:

```text
Customer: Rahul Kumar
Phone: 9876543210
Requirement: Sand
Quantity: 2
Unit: Tractor
Location: Main Road, Pakhanjur
Notes: Required tomorrow morning
Status: Pending
```

---

# 6. Order Status

The MVP should have three statuses:

```text
PENDING
COMPLETED
CANCELLED
```

Default status when creating an order:

```text
PENDING
```

When the manager completes the order:

```text
PENDING → COMPLETED
```

When an order is cancelled:

```text
PENDING → CANCELLED
```

Completed orders should retain their historical information.

---

# 7. Dashboard

The dashboard should be simple.

Example:

```text
---------------------------------------
          BUSINESS DASHBOARD
---------------------------------------

Today's Orders       12
Pending Orders        5
Completed Today       7

---------------------------------------
Recent Orders
---------------------------------------

#1024  Rahul Kumar
Sand • 2 Tractor
PENDING

#1023  Amit Kumar
Bricks • 1000 Pieces
COMPLETED

#1022  Ravi
Stone • 3 Tractor
PENDING
```

The dashboard should prioritize pending orders because they require attention.

---

# 8. Screens

The MVP should have these screens.

## 8.1 Login

Fields:

- Phone/email
- Password

Actions:

- Login

Authentication must be handled securely by the PHP backend.

---

## 8.2 Dashboard

Show:

- Total orders today
- Pending orders
- Completed orders today
- Recent orders
- Quick "Create Order" button

---

## 8.3 Create Order

Form:

- Customer name
- Phone number
- Requirement
- Quantity
- Unit
- Location
- Notes

Button:

```text
Create Order
```

After successful creation, redirect to the order details or orders list.

---

## 8.4 Orders

Display:

- Order ID
- Customer
- Requirement
- Quantity
- Status
- Date

Features:

- Search
- Status filter
- Date filter if useful
- Open order

---

## 8.5 Order Details

Display all order information.

Actions:

```text
Edit
Mark Complete
Cancel
Delete
```

Do not show "Mark Complete" when the order is already completed.

---

# 9. Recommended Architecture

The project will use:

### Frontend

**React**

Responsibilities:

- UI
- Navigation
- Forms
- Validation
- API calls
- State management
- Authentication state

### Backend

**PHP**

Responsibilities:

- REST API
- Authentication
- Authorization
- Validation
- Business logic
- Database operations
- Error handling

### Database

**MySQL**

Responsibilities:

- Users
- Customers
- Orders

### Development Environment

Recommended local setup:

```text
Windows
   ↓
XAMPP
   ├── Apache
   ├── PHP
   └── MySQL

React
   ↓
Frontend development server
   ↓
PHP REST API
   ↓
MySQL
```

---

# 10. Suggested Project Structure

Keep the project clean and separated.

```text
business-order-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.php
│   │
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── public/
│       └── index.php
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── README.md
│   └── API.md
│
└── README.md
```

The exact structure can be adjusted by the AI agent if there is a strong technical reason, but it must remain clean and understandable.

---

# 11. Database Design

For the MVP, keep the database small.

## users

```text
id
name
email
phone
password_hash
role
created_at
updated_at
```

## customers

```text
id
name
phone
created_at
updated_at
```

## orders

```text
id
customer_id
requirement
quantity
unit
location
notes
status
created_at
completed_at
updated_at
```

Relationship:

```text
User
  │
  └── manages → Orders

Customer
  │
  └── has → Orders
```

A customer can have multiple orders.

---

# 12. API Requirements

Use REST APIs.

Suggested endpoints:

## Authentication

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Orders

```text
GET    /api/orders
GET    /api/orders/{id}
POST   /api/orders
PUT    /api/orders/{id}
DELETE /api/orders/{id}

PATCH  /api/orders/{id}/complete
PATCH  /api/orders/{id}/cancel
```

## Customers

```text
GET  /api/customers
GET  /api/customers/{id}
POST /api/customers
PUT  /api/customers/{id}
```

The backend must validate all incoming data.

The frontend must never be trusted as the only validation layer.

---

# 13. Security Requirements

Security is important even for the MVP.

The AI agent must:

- Never store plain-text passwords.
- Use password hashing.
- Use prepared SQL statements/PDO.
- Validate and sanitize input.
- Prevent SQL injection.
- Prevent unauthorized API access.
- Protect authenticated routes.
- Never expose database credentials to React.
- Never put MySQL credentials in frontend code.
- Use environment/configuration variables where appropriate.
- Return safe API errors without exposing sensitive server information.

---

# 14. Android Application

The Android app should use the **same PHP REST API and MySQL database**.

Recommended architecture:

```text
                 ┌───────────────┐
                 │    MySQL      │
                 └───────▲───────┘
                         │
                    PHP REST API
                         │
             ┌───────────┴───────────┐
             │                       │
       React Web App           Android App
             │                       │
          Manager                 Manager
```

Do **not** create a separate PHP/MySQL backend for Android.

Both clients should communicate with the same API.

---

# 15. Recommended Android Approach

Because the frontend is already being built in React, the simplest approach is to build the Android app using:

## React Native + Expo

This allows the project to remain primarily within the React/JavaScript ecosystem.

Recommended stack:

```text
React
React Native
Expo
PHP
MySQL
REST API
```

The Android app should consume the same API used by the React web application.

Example:

```text
React Web
     │
     ├──────────────┐
     │              │
     ▼              ▼
PHP REST API ← Android React Native App
     │
     ▼
MySQL
```

This means:

- One backend
- One database
- Shared API
- Web application for desktop/mobile browser
- Native Android application for the manager

---

# 16. Android Development Setup

Install:

1. Node.js
2. npm
3. Git
4. Android Studio
5. Android SDK
6. Java/JDK required by the current React Native/Expo setup
7. Expo CLI/tools as required by the chosen Expo workflow

A modern Expo project can be started with:

```bash
npx create-expo-app@latest mobile
```

Then:

```bash
cd mobile
npm install
npx expo start
```

For development, you can test using:

- Android Emulator
- Physical Android phone

The Android app should call the PHP API using an API base URL.

Example concept:

```text
API_BASE_URL=https://your-domain.com/api
```

For local development, the Android emulator/device must be able to reach the machine running XAMPP. Do not blindly use `localhost` from the Android app because `localhost` on the phone/emulator refers to that device/emulator itself, not your Windows PC.

---

# 17. Development Phases

## Phase 1 — Backend

Build:

- MySQL database
- PHP API
- Authentication
- Customer APIs
- Order APIs
- Validation
- Error handling

## Phase 2 — React Web App

Build:

- Login
- Dashboard
- Create order
- Orders list
- Order details
- Edit order
- Complete order
- Cancel order
- Search/filter

## Phase 3 — Android

Build:

- Android project using React Native + Expo
- Login
- Dashboard
- Create order
- Orders
- Order details
- Complete/cancel order

## Phase 4 — Testing

Test:

- Authentication
- Creating orders
- Editing orders
- Completing orders
- Cancelling orders
- Searching
- API authorization
- Invalid input
- Network failures
- Android API connectivity

---

# 18. AI Agent Rules for This Project

The AI coding agent must follow these principles:

### Understand before coding

If a requirement is unclear or has multiple possible interpretations:

**STOP and ask the user before implementing it.**

Do not invent business requirements.

### MVP discipline

Do not add features outside the MVP without explicit approval.

Avoid feature creep.

### Code quality

Write:

- Clean code
- Short and understandable functions
- Reusable components
- Meaningful names
- Proper error handling
- Proper validation
- Minimal duplication

Do not create unnecessarily complex architecture.

### Security

Security must be considered in every backend implementation.

Never:

- Hardcode passwords
- Expose database credentials
- Trust client-side authorization
- Build raw SQL with unsanitized user input

### API-first consistency

The React web app and Android app must consume the same backend API.

Do not duplicate business logic unnecessarily between clients.

### Database safety

Never modify or delete production data automatically.

For schema changes, explain the migration before applying destructive changes.

### Before implementing large changes

Explain:

1. What will change
2. Which files will change
3. Why the change is needed
4. Any important tradeoffs

Then implement after approval when the change is significant or ambiguous.

---

# 19. Future Expansion

The architecture should allow future features, but they should **not be implemented in the MVP**.

Possible future modules:

```text
Orders
   ↓
Customers
   ↓
Payments
   ↓
Expenses
   ↓
Profit & Reports
   ↓
Tractors
   ↓
Drivers
   ↓
JCB / Machines
   ↓
Inventory
   ↓
Notifications
   ↓
Customer App
```

The MVP should remain focused on:

> **"A customer calls → manager records the order → manager tracks it → manager marks it completed."**

---

# 20. Final MVP Definition

If a feature does not directly help with this workflow:

```text
CALL
  ↓
RECORD
  ↓
TRACK
  ↓
COMPLETE
```

it should probably **not be part of the first version**.

The first version should be simple, fast, reliable, and easy for a non-technical business manager to use.
