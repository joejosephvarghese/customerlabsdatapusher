# 🚀 Data Pusher – Node.js Developer Assessment

An Express-based Node.js application designed to **receive and route JSON data** from accounts to multiple destination webhooks via custom HTTP configurations. This project is a developer assessment with full CRUD operations and secure data handling using secret tokens.

---

## 📦 Overview

This project implements an Express web server with:

- **Account Management**
- **Webhook Destination Configuration**
- **Secure Data Routing**
- **SQLite-based Persistence**

It receives JSON payloads for a specific account (authenticated via a secret token) and pushes the data to multiple destinations configured under that account.

---

## 🛠️ Technologies Used

- Node.js (Latest LTS)
- Express.js
- SQLite (via Sequelize ORM)
- Axios (HTTP client)
- dotenv (for environment management)
- UUID (for generating unique IDs and tokens)

---

## 📁 Project Structure


---

## 📌 Modules & Features

### 1. 🔐 Account Module

Each account contains:
- `account_id` (UUID - auto generated)
- `email` (Unique & Mandatory)
- `name` (Mandatory)
- `app_secret_token` (Generated automatically)
- `website` (Optional)

### 2. 🎯 Destination Module

Each destination belongs to an account and has:
- `url` (Mandatory)
- `http_method` (Mandatory: GET/POST/PUT)
- `headers` (Mandatory, stored as key-value pairs)

Example headers:
```json
{
  "APP_ID": "1234APPID1234",
  "APP_SECRET": "enwdj3bshwer43bjhjs9ereuinkjcnsiurew8s",
  "ACTION": "user.update",
  "Content-Type": "application/json",
  "Accept": "*"
}
