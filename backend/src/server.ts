import app from './app';
import { env } from './config/env';
import pool from './config/database';

const startServer = async () => {
  try {
    await pool.getConnection();
    console.log('Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

startServer();
