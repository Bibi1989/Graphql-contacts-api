import { db, sql } from "../model/contact-connect";
import bcrypt from "bcryptjs";
import uuid from "uuid";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const getAllContacts = () => {
  return db.query(sql`SELECT * FROM contacts`);
};

export const getContactsByUserId = (value: any) => {
  return db.query(sql`SELECT * FROM contacts WHERE owner_id=${value.id}`);
};

export const postContact = async (req: any, res: Response, value: Contacts) => {
  const userId = req.user.id;
  try {
    const contact = await db.query(sql`INSERT INTO contacts(first_name, owner_id, last_name, email, phone, company)
        VALUES (${value.first_name}, ${userId}, ${value.last_name}, ${value.email}, ${value.phone}, ${value.company}) RETURNING *
        `);
    res.status(200).json({ data: contact });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const postUser = async (value: User, req: Request, res: Response) => {
  // const token = jwt.sign(value.id, process.env.SECRET_KEY)
  // console.log(res)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(value.password, salt);
  const [
    save
  ] = await db.query(sql`INSERT INTO users (username, email, password)
    VALUES (${value.username}, ${value.email}, ${hashedPassword})
    RETURNING *
    `);
  const token = jwt.sign({ id: save.id }, process.env.SECRET_KEY);
  res.header("x-auth", token);
  res.json({ data: save, token });
  return save;
};

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Contacts {
  first_name: string;
  last_name: string;
  owner_id: string;
  email: string;
  phone: string;
  company: string;
}
