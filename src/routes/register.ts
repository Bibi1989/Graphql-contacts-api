import { Request, Response, Router } from 'express'
import { db, sql } from '../model/contact-connect'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()


// register
router.post('/register', async (req: Request, res: Response) => {

    const [existingUser] = await db.query(sql`SELECT email FROM users WHERE email = ${req.body.email}`)
    if (existingUser) {
      return res.status(404).json({ error: "Email exist" })
    }
    try {
      const { username, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const [contact] = await db.query(sql`
      INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPassword}) returning *`)
      const token = jwt.sign({ id: contact.id, username: contact.username }, process.env.SECRET_KEY)
      res.header("auth", token).status(200).json({ data: {
          id: contact.id,
          username: contact.username,
          email: contact.email
        }, 
        token 
      })
    } catch (error) {
      res.status(404).json({ error: error })
    }
})

export default router