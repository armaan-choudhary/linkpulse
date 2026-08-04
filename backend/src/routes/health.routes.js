import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database: states[dbState] || 'unknown',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
