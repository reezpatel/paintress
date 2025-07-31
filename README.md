# 🎨 Paintress

> A modern, encrypted notes application with a beautiful React frontend and robust FastAPI backend

<div align="center">
  
  ![Development Status](https://img.shields.io/badge/Status-In%20Development-orange.svg)
  ![Alpha Release](https://img.shields.io/badge/Alpha%20Release-Mid%20August%202024-blue.svg)
  
  **⚠️ Currently in Development**  
  *Alpha version coming mid-August 2025*
  
</div>

[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6.svg)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116.1+-009688.svg)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">
  <img src="paintress-web-app/public/logo.png" alt="Paintress Logo" width="200" height="200">
</div>

## ✨ Features

### 🔐 Security First
- **Client-side encryption** with RSA key pairs
- **JWT authentication** with access/refresh tokens
- **Google OAuth integration** for seamless login
- **Password hashing** with bcrypt

### 📝 Rich Text Editor
- **TipTap-based editor** with advanced formatting
- **Real-time collaboration** ready
- **Image uploads** with drag & drop
- **Version control** for note history

### 🏗️ Modern Architecture
- **React 19** with TypeScript for the frontend
- **FastAPI** with Python 3.13+ for the backend
- **SQLAlchemy** ORM with PostgreSQL/SQLite support
- **Docker** ready for easy deployment

### 🎯 User Experience
- **Responsive design** with Tailwind CSS
- **Dark/Light mode** support
- **Keyboard shortcuts** for power users
- **Offline-first** capabilities

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ and **npm** or **yarn**
- **Python** 3.13+ and **uv** (recommended) or **pip**
- **PostgreSQL** (optional, SQLite for development)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd paintress

# Build and run with Docker
docker build -t paintress .
docker run -p 8000:8000 paintress

# Access the application
open http://localhost:8000
```

### Option 2: Local Development

#### Backend Setup
```bash
# Navigate to backend
cd paintress-server

# Install dependencies
uv sync

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run the server
uv run python main.py
```

#### Frontend Setup
```bash
# Navigate to frontend
cd paintress-web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
paintress/
├── 🐳 Dockerfile              # Multi-stage Docker build
├── 📋 .dockerignore           # Docker build exclusions
├── 📖 README.md               # This file
├── 📄 LICENSE                 # MIT License
│
├── 🖥️ paintress-server/       # FastAPI Backend
│   ├── 🐍 main.py             # Application entry point
│   ├── 📦 pyproject.toml      # Python dependencies
│   ├── 🔧 app/                # Application modules
│   │   ├── 🔐 auth.py         # Authentication logic
│   │   ├── 🗄️ database.py     # Database models
│   │   ├── 📋 schemas.py      # Pydantic schemas
│   │   └── 🛣️ routers/        # API endpoints
│   └── 📁 static/             # Served frontend build
│
└── 🎨 paintress-web-app/      # React Frontend
    ├── 📦 package.json        # Node.js dependencies
    ├── ⚡ vite.config.ts      # Vite configuration
    ├── 🎯 src/                # Source code
    │   ├── 🧩 components/     # React components
    │   ├── 🎭 scene/          # Page components
    │   ├── 🪝 hooks/          # Custom React hooks
    │   └── 🎨 styles/         # SCSS stylesheets
    └── 📁 public/             # Static assets
```

## 🔧 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TipTap** - Rich text editor framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT** - JSON Web Token authentication
- **Google OAuth** - Social authentication
- **PostgreSQL/SQLite** - Database options

### DevOps
- **Docker** - Containerization
- **UV** - Fast Python package manager
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🔐 Security Features

### Client-Side Encryption
Notes can be encrypted client-side using RSA key pairs:
1. **Key Generation** - Client generates RSA key pairs
2. **Encryption** - Content encrypted with public key before sending
3. **Storage** - Server stores only encrypted content + public key
4. **Decryption** - Client uses private key to decrypt content
5. **Sharing** - Public keys enable secure sharing between users

### Authentication
- **JWT tokens** with automatic refresh
- **Google OAuth** integration
- **Password hashing** with bcrypt
- **CORS protection** and input validation

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## 🎨 UI Components

The frontend includes a comprehensive set of reusable components:

- **Editor** - Rich text editor with TipTap
- **Sidebar** - Navigation and folder management
- **Authentication** - Login/register forms
- **User Interface** - Buttons, dialogs, forms, etc.

## 🚀 Deployment

### Docker Deployment
```bash
# Build production image
docker build -t paintress:latest .

# Run with environment variables
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e SECRET_KEY=your-secret-key \
  paintress:latest
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./notes_app.db` |
| `SECRET_KEY` | JWT signing key | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `DEBUG` | Enable debug mode | `False` |

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup
```bash
# Install pre-commit hooks
pre-commit install

# Run tests
cd paintress-server && pytest
cd paintress-web-app && npm test

# Format code
cd paintress-server && black .
cd paintress-web-app && npm run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TipTap** for the excellent rich text editor
- **FastAPI** for the modern Python web framework
- **React** team for the amazing UI library
- **Tailwind CSS** for the utility-first CSS framework

---

<div align="center">
  <p>Made with ❤️ by the Paintress team</p>
  <p>
    <a href="#-paintress">Back to top</a>
  </p>
</div> 