"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_connect_1 = require("../model/contact-connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.Router();
// register
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [existingUser] = yield contact_connect_1.db.query(contact_connect_1.sql `SELECT email FROM users WHERE email = ${req.body.email}`);
    if (existingUser) {
        return res.status(404).json({ error: "Email exist" });
    }
    try {
        const { username, email, password } = req.body;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const [contact] = yield contact_connect_1.db.query(contact_connect_1.sql `
      INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPassword}) returning *`);
        const token = jsonwebtoken_1.default.sign({ id: contact.id, username: contact.username }, process.env.SECRET_KEY);
        res.header("auth", token).status(200).json({ data: {
                id: contact.id,
                username: contact.username,
                email: contact.email
            },
            token
        });
    }
    catch (error) {
        res.status(404).json({ error: error });
    }
}));
exports.default = router;
//# sourceMappingURL=register.js.map