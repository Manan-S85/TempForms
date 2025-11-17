# MongoDB Setup Guide for Windows

## Option 1: MongoDB Community Server (Recommended)

### Download and Install MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select "Windows" as platform
3. Download and install MongoDB Community Server
4. During installation, make sure to install "MongoDB as a Service"

### Start MongoDB Service
1. Open **Services** (Win + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click and select "Start"

Or use Command Prompt as Administrator:
```cmd
net start MongoDB
```

### Verify MongoDB is Running
Open Command Prompt and run:
```cmd
mongo --version
```

## Option 2: MongoDB Atlas (Cloud Database)

### Create Free Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string

### Update Environment Variables
Create a `.env` file in the `backend` folder:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempforms?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```

## Option 3: Docker (Alternative)

### Install Docker Desktop
1. Download Docker Desktop for Windows
2. Install and start Docker

### Run MongoDB Container
```cmd
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Current Status
- ✅ Fixed CSS color issues (danger/success → red/green)
- ✅ Fixed duplicate MongoDB schema indexes
- ❌ MongoDB not running locally

## Next Steps
1. Choose one of the MongoDB options above
2. Start MongoDB service
3. Restart the development server: `npm run dev`

The application should then work properly with the database connected.