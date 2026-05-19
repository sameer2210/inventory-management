import { createServer } from 'node:http';
import dotenv from 'dotenv';
import app from './src/app.js';
import { initializeDatabase } from './src/db/db.js';

dotenv.config();

const port = Number(process.env.PORT) || 8000;

const startServer = async () => {
  try {
    await initializeDatabase();

    const server = createServer(app);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error?.stack || error?.message || error);
    process.exit(1);
  }
};

startServer();
