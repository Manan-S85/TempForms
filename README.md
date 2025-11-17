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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Star.png" alt="star" width="25" height="25" /> Key Features

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Timer%20Clock.png" alt="timer" width="20" height="20" /> **Auto-Expiring Forms**
- **Smart Deletion**: Forms automatically delete after 15 minutes, 1 hour, 24 hours, or custom time periods
- **Zero Maintenance**: No manual cleanup required - MongoDB TTL handles everything
- **Data Privacy**: Guaranteed data removal for compliance and privacy

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Unlocked.png" alt="unlocked" width="20" height="20" /> **Frictionless Access**
- **No Registration**: Create and share forms instantly without accounts
- **Anonymous Usage**: No email, password, or personal information required
- **Quick Deploy**: From idea to shareable form in under 30 seconds

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="shield" width="20" height="20" /> **Privacy-First Architecture**
- **Zero Tracking**: No analytics, cookies, or user profiling
- **Temporary Storage**: All data has built-in expiration dates
- **Secure Links**: Cryptographically generated unique URLs

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Link.png" alt="link" width="20" height="20" /> **Smart Link Management**
- **Dual Links**: Separate URLs for form filling and response viewing
- **Password Protection**: Optional security for sensitive forms
- **Instant Sharing**: Copy-to-clipboard functionality

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" alt="tools" width="20" height="20" /> **Advanced Form Builder**
- **Multiple Field Types**: Text, Textarea, Multiple Choice, Yes/No, Rating scales
- **Real-time Preview**: See your form as you build it
- **Responsive Design**: Perfect rendering on all devices
- **Export Options**: CSV and JSON response exports

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/High%20Voltage.png" alt="performance" width="20" height="20" /> **Performance & Security**
- **Rate Limiting**: Built-in protection against spam and abuse
- **Input Validation**: Comprehensive server-side validation
- **Compression**: Optimized for fast loading
- **Mobile-First**: Designed primarily for mobile users

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="gear" width="25" height="25" /> Tech Stack

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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Rocket.png" alt="rocket" width="25" height="25" /> Quick Start

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bookmark%20Tabs.png" alt="requirements" width="20" height="20" /> Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png" alt="package" width="20" height="20" /> Installation

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
   - <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Globe%20with%20Meridians.png" alt="globe" width="16" height="16" /> Frontend: `http://localhost:3000`
   - <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Electric%20Plug.png" alt="plug" width="16" height="16" /> Backend API: `http://localhost:5000`

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png" alt="folder" width="25" height="25" /> Project Architecture

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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Electric%20Plug.png" alt="api" width="25" height="25" /> API Reference

<div align="center">

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `POST` | `/api/forms` | Create new temporary form | 10/hour per IP |
| `GET` | `/api/forms/:shareableLink` | Retrieve form for filling | 100/15min per IP |
| `POST` | `/api/forms/:shareableLink/responses` | Submit form response | 20/5min per IP |
| `GET` | `/api/responses/:responseLink` | View all form responses | 50/10min per IP |
| `GET` | `/health` | Health check endpoint | No limit |

</div>

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="security" width="20" height="20" /> Security Features

- **Rate Limiting**: Prevents spam and abuse with configurable limits
- **Input Validation**: Comprehensive server-side validation using express-validator
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet.js**: Security headers for XSS and other attack prevention
- **Data Compression**: Gzip compression for improved performance

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Card%20File%20Box.png" alt="database" width="25" height="25" /> Database Schema

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20with%20Curl.png" alt="form" width="18" height="18" /> Forms Collection

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

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clipboard.png" alt="response" width="18" height="18" /> Responses Collection

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
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Timer%20Clock.png" alt="timer" width="16" height="16" /> **TTL Indexes**: Automatic document deletion
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Link.png" alt="link" width="16" height="16" /> **Unique Links**: Cryptographically secure URLs
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" alt="locked" width="16" height="16" /> **Optional Encryption**: Password protection with bcrypt

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Direct%20Hit.png" alt="target" width="25" height="25" /> Use Cases

<div align="center">

| Use Case | Scenario | Benefits |
|----------|----------|----------|
| <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png" alt="education" width="20" height="20" /> **Education** | Class surveys, course feedback, quiz polls | No student accounts needed, automatic cleanup |
| <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Partying%20Face.png" alt="events" width="20" height="20" /> **Events** | Registration, feedback, RSVP collection | Quick setup, privacy-focused, temporary data |
| <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Building%20Construction.png" alt="corporate" width="20" height="20" /> **Corporate** | Anonymous HR surveys, team feedback | Guaranteed anonymity, compliance-friendly |
| <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png" alt="tech" width="20" height="20" /> **Tech Events** | Hackathon judging, team formation | Fast deployment, no registration friction |
| <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Chart%20Increasing.png" alt="research" width="20" height="20" /> **Research** | Quick polls, opinion gathering | Temporary data collection, export options |

</div>

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked%20with%20Key.png" alt="security" width="25" height="25" /> Privacy & Security

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="privacy" width="18" height="18" /> Privacy Guarantees

- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wastebasket.png" alt="delete" width="16" height="16" /> **Auto-Deletion**: All data automatically expires and is permanently deleted
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Eyes.png" alt="no-tracking" width="16" height="16" /> **Zero Tracking**: No cookies, analytics, or user profiling
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Person%20Raising%20Hand.png" alt="anonymous" width="16" height="16" /> **Complete Anonymity**: No personal information required or stored

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" alt="security" width="18" height="18" /> Security Measures

- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Stopwatch.png" alt="rate-limit" width="16" height="16" /> **Rate Limiting**: Configurable limits prevent spam and abuse
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Check%20Mark%20Button.png" alt="validation" width="16" height="16" /> **Input Validation**: Comprehensive sanitization and validation
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Key.png" alt="password" width="16" height="16" /> **Password Protection**: Optional bcrypt-hashed password security
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Link.png" alt="secure-links" width="16" height="16" /> **Secure URLs**: Cryptographically generated unique identifiers
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="helmet" width="16" height="16" /> **Security Headers**: Helmet.js protection against common vulnerabilities

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Rocket.png" alt="deployment" width="25" height="25" /> Deployment

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Cloud.png" alt="cloud" width="20" height="20" /> One-Click Deployment

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

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="config" width="20" height="20" /> Environment Variables

Set these in your deployment platform:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempforms
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-secure-jwt-secret
BCRYPT_ROUNDS=12
```

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Card%20File%20Box.png" alt="database" width="20" height="20" /> Database Setup

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

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Handshake.png" alt="contributing" width="25" height="25" /> Contributing

We welcome contributions that improve privacy, security, and user experience!

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="guidelines" width="20" height="20" /> Contribution Guidelines

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/privacy-enhancement`)
3. **Follow** existing code style and patterns
4. **Test** thoroughly (especially TTL and security features)
5. **Commit** with clear messages (`git commit -m 'Add: Enhanced rate limiting'`)
6. **Push** to your branch (`git push origin feature/privacy-enhancement`)
7. **Open** a Pull Request with detailed description

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="ideas" width="20" height="20" /> Areas for Contribution

- **Privacy Enhancements**: Additional anonymization features
- **Security Improvements**: Enhanced protection mechanisms
- **Performance Optimization**: Faster loading and processing
- **Field Types**: New form field components
- **Export Options**: Additional data export formats
- **UI/UX**: Improved user interface and experience
- **Documentation**: Better guides and API documentation

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20Facing%20Up.png" alt="license" width="25" height="25" /> License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Folded%20Hands.png" alt="acknowledgments" width="25" height="25" /> Acknowledgments

- **Privacy-First Design**: Built with GDPR and privacy regulations in mind
- **Open Source Community**: Inspired by the need for transparent, secure solutions
- **Modern Web Standards**: Leveraging latest React, Node.js, and MongoDB features
- **Security Best Practices**: Following OWASP guidelines for web application security

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mobile%20Phone.png" alt="contact" width="25" height="25" /> Want to Contribute or Collaborate?

If you're interested in making impactful improvements to Stealth Form, have ideas for new privacy features, or want to contribute to making forms more secure and anonymous, **I'd love to hear from you!**

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Envelope.png" alt="contact" width="20" height="20" /> Get in Touch

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