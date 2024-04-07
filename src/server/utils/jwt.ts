import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in your .env file');
  }
  
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};
