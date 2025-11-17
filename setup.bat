@echo off
echo 🚀 TempForms Setup Script
echo ========================

echo.
echo 📦 Installing dependencies...
call npm run install-all

echo.
echo 📝 Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from .env.example
    echo ⚠️  Please edit .env and add your MongoDB URI
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎯 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file and add your MongoDB URI
echo 2. Run: npm run dev (with MongoDB) or npm run dev-json (without MongoDB)
echo.
pause