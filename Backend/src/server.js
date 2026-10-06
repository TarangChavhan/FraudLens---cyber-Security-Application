import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import guidelineRoutes from './routes/guidelineRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { handleAnalyzeLink, getCheckHistory } from './controllers/aiController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FraudLens Backend API',
    time: new Date().toISOString(),
    database: 'connected',
    aiEnabled: !!process.env.OPENAI_API_KEY,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/ai', aiRoutes);

// Top-level endpoints mapped to AI analyzer with MongoDB persistence
app.post('/api/check-link', handleAnalyzeLink);
app.get('/api/check-history', getCheckHistory);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Start server after connecting to database
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(` FraudLens Backend Server running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` AI Services: http://localhost:${PORT}/api/ai/analyze-link`);
      console.log(` API Endpoint: http://localhost:${PORT}/api/reports`);
      console.log(`===========================================`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
