# Notes App API

A REST API for a notes application with client-side encryption, built with FastAPI and SQLite.

## Features

- **JWT Authentication** with access/refresh tokens
- **Google OAuth Integration** for social login
- **Client-side Encryption** with public/private key pairs
- **Hierarchical Notes Structure** (Users → Books → Notes → Nodes)
- **Version Control** for notes through node system
- **File Attachments** with secure upload
- **SQLite Database** for easy deployment
- **Automatic API Documentation** with OpenAPI/Swagger

## Architecture

- **Users**: Authentication and profile management
- **Books**: Collections of notes for organization
- **Notes**: Individual notes with encryption support
- **Nodes**: Versioned content for each note
- **Attachments**: File uploads with metadata

## Quick Start

### Prerequisites

- Python 3.13+
- UV package manager (recommended) or pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paintress-server
   ```

2. **Install dependencies**
   ```bash
   # Using UV (recommended)
   uv sync

   # Or using pip
   pip install -e .
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `SECRET_KEY`: A secure random string for JWT signing
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

4. **Run the application**
   ```bash
   # Development mode
   python main.py

   # Or using UV
   uv run python main.py

   # Production mode
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

5. **Access the API**
   - Frontend: http://localhost:8000 (serves static content)
   - API Documentation: http://localhost:8000/docs
   - API Health Check: http://localhost:8000/api/health
   - API Root: http://localhost:8000/api/root

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register with email/password
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/google-login` - Login with Google OAuth
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users (Coming Soon)
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `DELETE /api/v1/users/me` - Delete user account

### Books (Coming Soon)
- `GET /api/v1/books/` - List user's books
- `POST /api/v1/books/` - Create new book
- `GET /api/v1/books/{book_id}` - Get book details
- `PUT /api/v1/books/{book_id}` - Update book
- `DELETE /api/v1/books/{book_id}` - Delete book

### Notes (Coming Soon)
- `GET /api/v1/notes/book/{book_id}` - List notes in book
- `POST /api/v1/notes/book/{book_id}` - Create new note
- `GET /api/v1/notes/{note_id}` - Get note details
- `PUT /api/v1/notes/{note_id}` - Update note
- `DELETE /api/v1/notes/{note_id}` - Delete note

### Nodes (Coming Soon)
- `GET /api/v1/nodes/note/{note_id}` - Get note content
- `POST /api/v1/nodes/note/{note_id}` - Create new version
- `GET /api/v1/nodes/{node_id}` - Get specific node
- `PUT /api/v1/nodes/{node_id}` - Update node content

### Attachments (Coming Soon)
- `POST /api/v1/attachments/upload` - Upload file
- `GET /api/v1/attachments/{attachment_id}` - Download file
- `DELETE /api/v1/attachments/{attachment_id}` - Delete file

## Client-side Encryption

Notes marked with `isEncrypted=true` use client-side encryption:

1. **Key Generation**: Client generates RSA key pairs
2. **Encryption**: Content encrypted with public key before sending
3. **Storage**: Server stores only encrypted content + public key
4. **Decryption**: Client uses private key to decrypt content
5. **Sharing**: Public keys enable secure sharing between users

## Development

### Project Structure

```
paintress-server/
├── app/
│   ├── __init__.py
│   ├── config.py          # Application settings
│   ├── database.py        # Database connection
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # JWT authentication
│   ├── google_auth.py     # Google OAuth integration
│   ├── dependencies.py    # FastAPI dependencies
│   └── routers/
│       ├── __init__.py
│       └── auth.py        # Authentication endpoints
├── main.py                # FastAPI application
├── pyproject.toml         # Project dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

### Running Tests

```bash
# Install development dependencies
uv sync --group dev

# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

### Database Configuration

The application supports both SQLite and PostgreSQL databases through configuration.

#### SQLite (Default)
- **Development**: Perfect for local development and testing
- **Configuration**: `DATABASE_URL=sqlite:///./notes_app.db`
- **Setup**: No additional setup required - database file created automatically

#### PostgreSQL (Recommended for Production)
- **Production**: Better performance, concurrent connections, and advanced features
- **Configuration**: `DATABASE_URL=postgresql://username:password@localhost:5432/notes_app`
- **Async Support**: `DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/notes_app`

##### PostgreSQL Setup Steps:

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # macOS
   brew install postgresql

   # Or use Docker
   docker run --name notes-postgres -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
   ```

2. **Create Database and User**
   ```sql
   -- Connect as postgres user
   sudo -u postgres psql

   -- Create database
   CREATE DATABASE notes_app;

   -- Create user
   CREATE USER notes_user WITH PASSWORD 'your_secure_password';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE notes_app TO notes_user;

   -- Exit
   \q
   ```

3. **Update Environment Variables**
   ```env
   # Standard PostgreSQL connection
   DATABASE_URL=postgresql://notes_user:your_secure_password@localhost:5432/notes_app

   # For better async performance
   DATABASE_URL=postgresql+asyncpg://notes_user:your_secure_password@localhost:5432/notes_app
   ```

4. **Install Dependencies**
   ```bash
   # Dependencies are already included in pyproject.toml
   uv sync  # or pip install -e .
   ```

The application automatically detects the database type from the URL and configures the appropriate connection parameters, connection pooling, and optimization settings.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy Client ID and Client Secret to `.env`

## Deployment

### Docker (Coming Soon)

```bash
# Build image
docker build -t notes-app .

# Run container
docker run -p 8000:8000 notes-app
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./notes_app.db` |
| `SECRET_KEY` | JWT signing key | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `DEBUG` | Enable debug mode | `False` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:8080` |

## Security Features

- JWT access/refresh token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection prevention via ORM
- File upload security validation
- Client-side encryption support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.