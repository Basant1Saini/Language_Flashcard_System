# Language Flashcard System

A modern, full-stack language learning application built with the MERN stack, featuring interactive flashcards, spaced repetition algorithms, and progress tracking.

## 🚀 Tech Stack

- **Frontend**: React 18+ with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API / Redux Toolkit
- **HTTP Client**: Axios
- **Development**: ESLint, Prettier, Nodemon

## ✨ Features

- 🎯 Interactive flashcard system with flip animations
- 📚 Multiple language support and custom deck creation
- 🧠 Spaced repetition algorithm for optimal learning
- 📊 Progress tracking and learning analytics
- 👤 User authentication and personalized learning paths
- 📱 Responsive design for mobile and desktop
- 🔍 Search and filter flashcards
- 📈 Performance metrics and streak tracking
- 🎨 Modern UI with Tailwind CSS components

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Language_Flashcard_System.git
   cd Language_Flashcard_System
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both backend and frontend directories:
   
   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flashcard_system
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000
   ```
   
   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Language Flashcard System
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using MongoDB Compass/Atlas connection
   ```

5. **Run the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend development server (from frontend directory)
   npm run dev
   ```

## 📁 Project Structure

```
Language_Flashcard_System/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── flashcardController.js
│   │   ├── deckController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Deck.js
│   │   ├── Flashcard.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── flashcards.js
│   │   ├── decks.js
│   │   └── users.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── spacedRepetition.js
│   │   └── validators.js
│   ├── config/
│   │   └── database.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── flashcards/
│   │   │   ├── decks/
│   │   │   └── auth/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Study.jsx
│   │   │   └── Profile.jsx
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Decks
- `GET /api/decks` - Get all user decks
- `POST /api/decks` - Create new deck
- `GET /api/decks/:id` - Get specific deck
- `PUT /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck

### Flashcards
- `GET /api/flashcards/:deckId` - Get flashcards by deck
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard
- `POST /api/flashcards/:id/review` - Submit flashcard review

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/stats` - Get learning statistics

## 🎨 Tailwind CSS Configuration

The project uses a custom Tailwind configuration with:

- Custom color palette for language learning themes
- Responsive breakpoints for mobile-first design
- Custom animations for flashcard flips
- Typography scales optimized for readability
- Dark mode support

## 🧠 Spaced Repetition Algorithm

Implements the SM-2 algorithm for optimal learning intervals:

- **Easy**: Next review in 4 days
- **Good**: Next review in 1-3 days
- **Hard**: Next review in 1 day
- **Again**: Immediate review

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Optimized for screens from 320px to 4K
- Touch-friendly interface for mobile devices
- Progressive Web App (PWA) capabilities

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- XSS protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/Heroku)
```bash
# Set environment variables
# Deploy with your preferred platform
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in environment variables

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools

## 📞 Support

For support, email support@flashcardsystem.com or join our Slack channel.

---

**Happy Learning! 🎓**