# 🚀 Data Pusher – Node.js Developer Assessment

## 📜 Description

**Data Pusher** is a Node.js-based backend application built using **Express.js** and **SQLite**. It allows receiving JSON data from multiple accounts and securely forwards it to pre-configured destinations using webhooks.

This project demonstrates secure data handling, RESTful API design, and real-time data forwarding as part of a Node.js developer assessment.

---

## 🌟 Features

👤 **Account management:** Create and manage unique accounts with secret tokens.

🌐 **Destination configuration:** Configure multiple webhook destinations per account.

🔒 **Secure routing:** Authenticate using tokens before routing data.

📤 **Dynamic data push:** Automatically forwards JSON data to all matching destinations.

📄 **RESTful APIs:** Fully featured CRUD operations for accounts and destinations.

---

## 🛠 Technologies Used

🟩 **Node.js:** JavaScript runtime built on Chrome’s V8 engine.

⚙️ **Express.js:** Minimalist web framework for Node.js.

📦 **SQLite:** Lightweight SQL database engine (via Sequelize ORM).

🔁 **Axios:** HTTP client used for sending requests to webhook destinations.

🔐 **dotenv:** Loads environment variables from a `.env` file.

🆔 **UUID:** For generating unique account IDs and secret tokens.

---

## 📋 Prerequisites

Ensure you have the following installed on your system:

- 🟢 **Node.js** (Latest LTS recommended)
- 📦 **npm** (Comes with Node.js)

---

## ⚙️ Configuration

Create a `.env` file in the project root directory and add:

```env
PORT=3000
NODE_ENV=development
