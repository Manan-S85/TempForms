# TempForms 🚀

## ⭐ Unique Features

**TempForms** is a privacy-focused, temporary form builder that automatically deletes data after specified time periods. Perfect for anonymous feedback, quick surveys, and one-time event forms.

### 🔥 Key Features

1. **Temporary Forms (Auto-Expiring)**
   - Forms automatically delete after: 15 minutes, 1 hour, 24 hours, or custom time
   - Zero manual cleanup required

2. **No Login Required**
   - Create and share forms instantly
   - No sign-up, email, or password needed
   - True frictionless form creation

3. **Anonymous & Privacy-Focused**
   - No permanent data storage
   - No tracking or analytics
   - All data auto-deleted using MongoDB TTL

4. **Lightweight Shareable Links**
   - Instant link generation for form filling
   - Separate link for viewing responses
   - Optional password protection

5. **Dynamic Field Builder**
   - Text, Textarea, Multiple Choice, Yes/No, Rating fields
   - Easy drag-and-drop interface

6. **Minimal & Fast UI**
   - Designed for quick polling and feedback
   - Mobile-first responsive design

## 🛠️ Tech Stack

- **Backend**: Express.js + MongoDB with TTL indexes
- **Frontend**: React 18 + Tailwind CSS
- **Database**: MongoDB with automatic TTL deletion
- **Deployment**: Ready for Vercel/Netlify + MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd TempForms
   npm run install-all
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example file to create your .env (in root directory)
   cp .env.example .env
   
   # Edit .env and add your MongoDB URI:
   MONGODB_URI=mongodb://localhost:27017/tempforms
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempforms
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend app on `http://localhost:3000`

## 📁 Project Structure

```
TempForms/
├── backend/
│   ├── models/
│   │   ├── Form.js          # Form schema with TTL
│   │   └── Response.js      # Response schema with TTL
│   ├── routes/
│   │   ├── forms.js         # Form CRUD operations
│   │   └── responses.js     # Response handling
│   ├── middleware/
│   │   ├── validation.js    # Input validation
│   │   └── rateLimiter.js   # Rate limiting
│   ├── utils/
│   │   └── linkGenerator.js # Secure link generation
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder.jsx    # Dynamic form creation
│   │   │   ├── FormRenderer.jsx   # Form display and filling
│   │   │   ├── ResponseViewer.jsx # Response viewing
│   │   │   └── FieldComponents/   # Individual field types
│   │   ├── pages/
│   │   │   ├── CreateForm.jsx     # Form creation page
│   │   │   ├── FillForm.jsx       # Form filling page
│   │   │   └── ViewResponses.jsx  # Response viewing page
│   │   ├── utils/
│   │   │   ├── api.js             # API client
│   │   │   └── constants.js       # App constants
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── package.json
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/forms` | Create new form |
| GET | `/api/forms/:shareableLink` | Get form for filling |
| POST | `/api/forms/:shareableLink/responses` | Submit form response |
| GET | `/api/responses/:responseLink` | View all responses |

## 🗄️ Database Schema

### Forms Collection
- Auto-expires using MongoDB TTL indexes
- Unique shareable and response links
- Support for multiple field types
- Optional password protection

### Responses Collection
- Linked to parent form
- Auto-expires with same TTL as form
- Structured answer storage

## 🎯 Use Cases

Perfect for:
- **Students**: Quick class surveys and feedback
- **Event Organizers**: Registration and feedback forms
- **Hackathons**: Team formation and judging
- **Anonymous Feedback**: HR surveys, course evaluations
- **Quick Polls**: Decision making and opinion gathering

## 🔒 Privacy & Security

- **No permanent data storage** - everything auto-deletes
- **No user tracking** - completely anonymous
- **Rate limiting** to prevent spam
- **Input validation** and sanitization
- **Optional password protection** for sensitive responses
- **Secure link generation** using cryptographic methods

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Set environment variables in platform
# Deploy with npm start
```

### Database
- Use MongoDB Atlas for production
- TTL indexes are automatically created

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for privacy-conscious users
- Inspired by the need for temporary, frictionless form solutions
- Designed with simplicity and security in mind

---

**TempForms** - Because sometimes you just need a quick, private form that disappears when you're done. 🚀