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
const contact_connect_1 = require("../model/contact-connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.getAllContacts = () => {
    return contact_connect_1.db.query(contact_connect_1.sql `SELECT * FROM contacts`);
};
exports.getContactsByUserId = (value) => {
    return contact_connect_1.db.query(contact_connect_1.sql `SELECT * FROM contacts WHERE owner_id=${value.id}`);
};
exports.postContact = (req, res, value) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const contact = yield contact_connect_1.db.query(contact_connect_1.sql `INSERT INTO contacts(first_name, owner_id, last_name, email, phone, company)
        VALUES (${value.first_name}, ${userId}, ${value.last_name}, ${value.email}, ${value.phone}, ${value.company}) RETURNING *
        `);
        res.status(200).json({ data: contact });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.postUser = (value, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = jwt.sign(value.id, process.env.SECRET_KEY)
    // console.log(res)
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(value.password, salt);
    const [save] = yield contact_connect_1.db.query(contact_connect_1.sql `INSERT INTO users (username, email, password)
    VALUES (${value.username}, ${value.email}, ${hashedPassword})
    RETURNING *
    `);
    const token = jsonwebtoken_1.default.sign({ id: save.id }, process.env.SECRET_KEY);
    res.header("x-auth", token);
    res.json({ data: save, token });
    return save;
});
//# sourceMappingURL=contacts.js.map