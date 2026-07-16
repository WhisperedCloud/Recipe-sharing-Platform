const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import Associations & Sync
require('./models'); 

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // Body parser

const allowedOrigins = ['http://localhost:3000', 'https://foodiespace.vercel.app'];

// Support Private Network Access (so Vercel can fetch from localhost for local testing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  credentials: true 
})); // Explicitly allow frontend

// Database Connection
connectDB();

// Sync Models (Use alter:true in dev to modify tables without dropping)
// Set to false in production, handle with migrations instead.
sequelize.sync({ alter: true })
  .then(() => console.log('✅ PostgreSQL Database Synced'))
  .catch((err) => console.log('❌ Failed to sync database:', err.message));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipes/:recipeId/comments', commentRoutes);
app.use('/api/comments', commentRoutes); // For direct deletion
app.use('/api/recipes/:recipeId/likes', likeRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Recipe Sharing Platform API is running...');
});

// Custom Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
