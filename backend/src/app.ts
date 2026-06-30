import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import transaksiRoutes from './routes/transaksiRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/users', userRoutes);

export default app;
