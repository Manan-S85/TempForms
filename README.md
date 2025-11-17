<div align="center">

# Stealth Form

<p align="center">
  <img src="https://img.shields.io/badge/privacy-focused-green?style=for-the-badge&logo=shield" alt="Privacy Focused" />
  <img src="https://img.shields.io/badge/auto-delete-enabled-red?style=for-the-badge&logo=clock" alt="Auto Delete" />
  <img src="https://img.shields.io/badge/no-signup-required-blue?style=for-the-badge&logo=user-check" alt="No Signup" />
</p>

**A privacy-first, temporary form builder that automatically deletes data after specified time periods. Perfect for anonymous feedback, quick surveys, and secure one-time event forms.**

[<img src="https://img.shields.io/badge/Live_Demo-Visit_Site-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" />](https://your-vercel-url.vercel.app)

</div>

---

## ⭐ Key Features

### ⏰ **Auto-Expiring Forms**
- **Smart Deletion**: Forms automatically delete after 15 minutes, 1 hour, 24 hours, or custom time periods
- **Zero Maintenance**: No manual cleanup required - MongoDB TTL handles everything
- **Data Privacy**: Guaranteed data removal for compliance and privacy

### 🔓 **Frictionless Access**
- **No Registration**: Create and share forms instantly without accounts
- **Anonymous Usage**: No email, password, or personal information required
- **Quick Deploy**: From idea to shareable form in under 30 seconds

### 🛡️ **Privacy-First Architecture**
- **Zero Tracking**: No analytics, cookies, or user profiling
- **Temporary Storage**: All data has built-in expiration dates
- **Secure Links**: Cryptographically generated unique URLs

### 🔗 **Smart Link Management**
- **Dual Links**: Separate URLs for form filling and response viewing
- **Password Protection**: Optional security for sensitive forms
- **Instant Sharing**: Copy-to-clipboard functionality

### 🛠️ **Advanced Form Builder**
- **Multiple Field Types**: Text, Textarea, Multiple Choice, Yes/No, Rating scales
- **Real-time Preview**: See your form as you build it
- **Responsive Design**: Perfect rendering on all devices
- **Export Options**: CSV and JSON response exports

### ⚡ **Performance & Security**
- **Rate Limiting**: Built-in protection against spam and abuse
- **Input Validation**: Comprehensive server-side validation
- **Compression**: Optimized for fast loading
- **Mobile-First**: Designed primarily for mobile users

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" /> | Modern React 18 with Vite build system and utility-first CSS |
| **Backend** | <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white" /> | RESTful API with Express.js framework |
| **Database** | <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" /> | Document database with TTL (Time To Live) indexes |
| **Deployment** | <img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white" /> | Serverless deployment with cloud database |
| **Security** | <img src="https://img.shields.io/badge/Helmet.js-663399?style=flat&logo=helmet&logoColor=white" /> <img src="https://img.shields.io/badge/CORS-FF6B6B?style=flat" /> | Security headers and cross-origin protection |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manan-S85/TempForms.git
   cd TempForms
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in root directory
   touch .env
   
   # Add your configuration (see .env file for full configuration)
   MONGODB_URI=mongodb://localhost:27017/tempforms
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempforms
   
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development environment**
   ```bash
   npm run dev
   ```

   **Servers will start:**
   - 🌐 Frontend: `http://localhost:3000`
   - 🔌 Backend API: `http://localhost:5000`

---

## 📁 Project Architecture

```
TempForms/
├── 📂 backend/                     # Express.js API Server
│   ├── 📂 models/
│   │   ├── Form.js                 # MongoDB schema with TTL indexes
│   │   └── Response.js             # Response data model
│   ├── 📂 routes/
│   │   ├── forms.js                # Form CRUD operations
│   │   ├── forms-json.js           # JSON database fallback
│   │   ├── responses.js            # Response handling
│   │   └── responses-json.js       # JSON response fallback
│   ├── 📂 middleware/
│   │   ├── validation.js           # Input validation & sanitization
│   │   └── rateLimiter.js          # Rate limiting protection
│   ├── 📂 utils/
│   │   ├── linkGenerator.js        # Secure URL generation
│   │   └── jsonDatabase.js         # JSON file database utility
│   ├── 📂 data/                    # JSON database files (development)
│   ├── server.js                   # Main Express server
│   ├── server-json.js              # JSON database server
│   └── package.json
├── 📂 frontend/                    # React + Vite Application
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── ErrorBoundary.jsx   # Error handling wrapper
│   │   │   ├── Layout.jsx          # Main layout component
│   │   │   └── LoadingSpinner.jsx  # Loading states
│   │   ├── 📂 pages/
│   │   │   ├── CreateFormPage.jsx  # Form builder interface
│   │   │   ├── FillFormPage.jsx    # Form filling experience
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── NotFoundPage.jsx    # 404 error page
│   │   │   └── ViewResponsesPage.jsx # Response analytics
│   │   ├── 📂 utils/
│   │   │   ├── api.js              # Axios API client
│   │   │   └── constants.js        # App constants
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind CSS styles
│   ├── 📂 public/
│   │   └── manifest.json           # PWA manifest
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json
├── 📂 api/                         # Vercel serverless functions
│   └── index.js                    # API entry point for deployment
├── vercel.json                     # Vercel deployment config
├── .env                            # Environment variables
└── package.json                    # Root package configuration
```

---

## 🔌 API Reference

<div align="center">

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `POST` | `/api/forms` | Create new temporary form | 10/hour per IP |
| `GET` | `/api/forms/:shareableLink` | Retrieve form for filling | 100/15min per IP |
| `POST` | `/api/forms/:shareableLink/responses` | Submit form response | 20/5min per IP |
| `GET` | `/api/responses/:responseLink` | View all form responses | 50/10min per IP |
| `GET` | `/health` | Health check endpoint | No limit |

</div>

### 🛡️ Security Features

- **Rate Limiting**: Prevents spam and abuse with configurable limits
- **Input Validation**: Comprehensive server-side validation using express-validator
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet.js**: Security headers for XSS and other attack prevention
- **Data Compression**: Gzip compression for improved performance

---

## 🗃️ Database Schema

### 📄 Forms Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  fields: [
    {
      type: String, // 'text', 'textarea', 'multiple-choice', 'yes-no', 'rating'
      label: String,
      required: Boolean,
      options: [String] // for multiple-choice fields
    }
  ],
  shareableLink: String,    // Unique URL for form filling
  responseLink: String,     // Unique URL for viewing responses
  expiresAt: Date,         // TTL index - auto-deletion
  passwordProtected: Boolean,
  password: String,        // Hashed password (optional)
  createdAt: Date,
  updatedAt: Date
}
```

### 📋 Responses Collection

```javascript
{
  _id: ObjectId,
  formId: ObjectId,        // Reference to parent form
  responses: [
    {
      fieldId: String,
      value: Mixed         // String, Number, Array depending on field type
    }
  ],
  submittedAt: Date,
  expiresAt: Date,        // Same TTL as parent form
  ipAddress: String       // Hashed for rate limiting (not stored permanently)
}
```

**Key Features:**
- ⏰ **TTL Indexes**: Automatic document deletion
- 🔗 **Unique Links**: Cryptographically secure URLs
- 🔒 **Optional Encryption**: Password protection with bcrypt

---

## 🎯 Use Cases

<div align="center">

| Use Case | Scenario | Benefits |
|----------|----------|----------|
| 🎓 **Education** | Class surveys, course feedback, quiz polls | No student accounts needed, automatic cleanup |
| 🎉 **Events** | Registration, feedback, RSVP collection | Quick setup, privacy-focused, temporary data |
| 🏢 **Corporate** | Anonymous HR surveys, team feedback | Guaranteed anonymity, compliance-friendly |
| 💻 **Tech Events** | Hackathon judging, team formation | Fast deployment, no registration friction |
| 📈 **Research** | Quick polls, opinion gathering | Temporary data collection, export options |

</div>

---

## 🔐 Privacy & Security

### 🛡️ Privacy Guarantees

- 🗑️ **Auto-Deletion**: All data automatically expires and is permanently deleted
- 👀 **Zero Tracking**: No cookies, analytics, or user profiling
- 🙋 **Complete Anonymity**: No personal information required or stored

### 🔒 Security Measures

- ⏱️ **Rate Limiting**: Configurable limits prevent spam and abuse
- ✅ **Input Validation**: Comprehensive sanitization and validation
- 🔑 **Password Protection**: Optional bcrypt-hashed password security
- 🔗 **Secure URLs**: Cryptographically generated unique identifiers
- 🛡️ **Security Headers**: Helmet.js protection against common vulnerabilities

---

## 🚀 Deployment

### ☁️ One-Click Deployment

#### Vercel (Recommended)
```bash
# Deploy to Vercel with full-stack support
npm install -g vercel
vercel --prod

# Or use Vercel CLI
npx vercel --prod
```

#### Manual Deployment
```bash
# Build frontend
cd frontend && npm run build

# The built files will be in frontend/dist/
# Backend API routes are in /api/index.js for serverless deployment
```

### ⚙️ Environment Variables

Set these in your deployment platform:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempforms
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-secure-jwt-secret
BCRYPT_ROUNDS=12
```

### 🗃️ Database Setup

1. **MongoDB Atlas** (Recommended for production)
   - Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
   - Whitelist your deployment IP addresses
   - TTL indexes are automatically created

2. **Local MongoDB** (Development only)
   ```bash
   # Install MongoDB locally
   # TTL cleanup happens automatically
   ```

---

## 🤝 Contributing

We welcome contributions that improve privacy, security, and user experience!

### 📝 Contribution Guidelines

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/privacy-enhancement`)
3. **Follow** existing code style and patterns
4. **Test** thoroughly (especially TTL and security features)
5. **Commit** with clear messages (`git commit -m 'Add: Enhanced rate limiting'`)
6. **Push** to your branch (`git push origin feature/privacy-enhancement`)
7. **Open** a Pull Request with detailed description

### 💡 Areas for Contribution

- **Privacy Enhancements**: Additional anonymization features
- **Security Improvements**: Enhanced protection mechanisms
- **Performance Optimization**: Faster loading and processing
- **Field Types**: New form field components
- **Export Options**: Additional data export formats
- **UI/UX**: Improved user interface and experience
- **Documentation**: Better guides and API documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Privacy-First Design**: Built with GDPR and privacy regulations in mind
- **Open Source Community**: Inspired by the need for transparent, secure solutions
- **Modern Web Standards**: Leveraging latest React, Node.js, and MongoDB features
- **Security Best Practices**: Following OWASP guidelines for web application security

---

## 📱 Want to Contribute or Collaborate?

If you're interested in making impactful improvements to Stealth Form, have ideas for new privacy features, or want to contribute to making forms more secure and anonymous, **I'd love to hear from you!**

### ✉️ Get in Touch

- **GitHub Issues**: [Open an issue](https://github.com/Manan-S85/TempForms/issues) for feature requests or bugs
- **Pull Requests**: Contribute directly with your improvements
- **Email**: Contact me for larger collaboration opportunities
- **Discussion**: Share your ideas in the [Discussions](https://github.com/Manan-S85/TempForms/discussions) section

**Areas of Interest:**
- Privacy and security enhancements
- Performance optimizations
- New field types and features
- UI/UX improvements
- Documentation and tutorials

---

<div align="center">

**Stealth Form** - *Privacy-first temporary forms that disappear when you're done.*

<img src="https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/Privacy-First-green?style=for-the-badge&logo=shield" />
<img src="https://img.shields.io/badge/Open_Source-Forever-blue?style=for-the-badge&logo=github" />

[⭐ Star this repo](https://github.com/Manan-S85/TempForms) • [🐛 Report Bug](https://github.com/Manan-S85/TempForms/issues) • [✨ Request Feature](https://github.com/Manan-S85/TempForms/issues)

</div>