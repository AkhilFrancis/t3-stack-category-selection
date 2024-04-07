// sessionManager.ts
import jwt from 'jsonwebtoken';

/**
 * Decodes the JWT token and returns the session data.
 * @param token The JWT token.
 * @returns The decoded session data or null if decoding fails.
 */
export async function decodeSession(token: string): Promise<{ userId: string } | null> {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined.');
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    console.log(`decoded is ${decoded.userId}`);
    if (decoded?.userId) {
      return { userId: decoded.userId };
    }
  } catch (error) {
    console.error('Failed to decode session:', error);
  }
  return null;
}
