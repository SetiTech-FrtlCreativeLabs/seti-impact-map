@echo off
echo 🚀 Setting up SETI.Impact MAP for GitHub deployment...

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: SETI.Impact MAP platform with Stripe integration"
) else (
    echo ✅ Git repository already initialized
)

REM Create .env file from example if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please update .env with your actual configuration values
) else (
    echo ✅ .env file already exists
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Install contract dependencies
echo 📦 Installing contract dependencies...
cd contracts
npm install
cd ..

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Update your .env file with actual configuration values:
echo    - Database URLs
echo    - Stripe keys
echo    - API keys
echo    - Blockchain configuration
echo.
echo 2. Create a GitHub repository:
echo    - Go to https://github.com/new
echo    - Repository name: seti-impact-map
echo    - Make it public or private
echo    - Don't initialize with README (we already have one)
echo.
echo 3. Connect your local repository to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/seti-impact-map.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Configure environment variables
echo    - Deploy!
echo.
echo 5. Set up your database:
echo    - Use Vercel Postgres or external service
echo    - Run migrations: npm run migrate
echo    - Seed data: npm run seed
echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
echo Happy coding! 🚀
pause
