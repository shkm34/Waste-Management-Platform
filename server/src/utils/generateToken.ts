import jwt from 'jsonwebtoken';
import { JWT_SECRET , JWT_EXPIRE } from '../config/constants';

export interface JWTPayload {
    userId: string,
    email: string,
    role: string

}
export const generateToken = (
    userId: string,
    email: string,
    role: string
) => {
    // Create Payload with user info
    const payload: JWTPayload = {
        userId, email, role
    }
    
    // Sign and return token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE as any });
    return token;
}


//  Verify token, return decoded payload if valid,
//  throw error if invalid 

export const verifyToken = (token: string): JWTPayload =>{
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
        return decoded
    } catch(error: any) {
        if(error.name === 'TokenExpiredError') {
            throw new Error('Token has Expired')
        } else if(error.name === 'JsonWebTokenError') {
            throw new Error('Invalid Token')
        } else {
            throw new Error('Token Verification Failed')
        }
    }
}