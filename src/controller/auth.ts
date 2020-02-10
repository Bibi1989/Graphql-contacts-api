import express, { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const Auth = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['x-auth']
    if(!token) return res.status(404).json({tokenMessage: "unauthorize user, access denied"})
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.json({ errors: error })
    }
}