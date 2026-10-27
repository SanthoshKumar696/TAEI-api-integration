import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { User } from 'src/models/User.model';

interface AuthResponse {
  valid: boolean;
  user?: User;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    const response = await axios.get<AuthResponse>(
      `${process.env.AUTH_SERVER}/api/auth/validate-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.valid) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    (req as any).user = response.data.user;
    next();
  } catch (err: any) {
    console.error('Token validation failed:', err.message);
    return res.status(401).json({ message: 'Token validation failed' });
  }
};
