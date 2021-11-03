'use strict';
const dotenv = require('dotenv');
dotenv.config();

// PORT
const PORT = process.env.PORT || "8080";
// DATABASE
const SQL_USER = process.env.SQL_USER;
const SQL_PASSWORD = process.env.SQL_PASSWORD;
const SQL_DATABASE = process.env.SQL_DATABASE;
const SQL_SERVER = process.env.SQL_SERVER;
// TOKEN
const ISSUER = process.env.ISSUER || "daousign";
const SUBJECT = process.env.SUBJECT || "daousign";
const AUDIENCE = process.env.AUDIENCE || "daousign";
const ALGORITHM = process.env.ALGORITHM || "HS256";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "daousign";
const EXPIRES_IN = process.env.EXPIRES_IN || "1h";

module.exports = {
    port: PORT,
    database: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        database: SQL_DATABASE,
        server: SQL_SERVER
    },
    tokenJWT: {
        issuer: ISSUER,
        subject: SUBJECT,
        audience: AUDIENCE,
        algorithm: ALGORITHM,
        token_secret: TOKEN_SECRET,
        expiresIn: EXPIRES_IN,
    }
};