const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");
const cookieParser = require("cookie-parser");

const Base64 = require("crypto-js/enc-base64");
const latin1 = require("crypto-js/enc-latin1");
const sha256 = require("crypto-js/sha256");
const AES = require("crypto-js/aes");

const secret = "SuperSecretPassphrase";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post('/login', async (req, res) => {
    const { authorization } = req.headers;
    const userpass = authorization.split(" ")[1];
    const user_email = latin1.stringify(Base64.parse(userpass)).split(":")[0];
    const password = sha256(latin1.stringify(Base64.parse(userpass)).split.apply(":")[1]);

    const user = await pool.query("SELECT ISADMIN FROM USERINFO WHERE USER_EMAIL = $1 AND USER_PASSWORD = $2", [user_email, password]);

    if (!user.rows) {
        res.status(401).send("User not found");
    }
    else {
        const expire = Date.now() + 36000000;
        const ip = req.ip;
        const cookie = AES.encrypt(ip + ":" + expire, secret);
        await pool.query("INSERT INTO USERS_LOGGED_IN(USER_EMAIL, COOKIE) VALUES($1, $2)", [user_email, cookie]);

        res.cookie('dungeon', 'cookie').status(200).send("Logged in");
    }
});

app.get('/login/:userid', async (req, res) => {
    const { dungeon } = req.cookies;
    const userid = req.userid;
    const cookie_check = await pool.query("SELECT COOKIE FROM USERS_LOGGED_IN WHERE USER_EMAIL = $1", [userid]);
    const cookie = AES.decrypt(dungeon, secret);
    if (cookie_check.rowCount > 0) {
        if (dungeon != cookie_check.rows[0].COOKIE || req.ip != cookie.split(":")[0] || Date.now() > cookie.split(":")[1]) {
            await pool.query("DELETE FROM USER_LOGGED_IN WHERE USER_EMAIL = $1", [userid]);
            res.status(401).send("User timed out");
        }
        else {
            const new_cookie = AES.encrypt(req.ip + ":" + (Date.now + 3600000), secret);
            await pool.query("UPDATE USER_LOGGED_IN SET COOKIE = $1 WHERE USER_EMAIL = $2", [new_cookie, userid]);
            res.status(200).send("User logged in");
        }
    }
    else {
        res.status(401).send("User not logged in");
    }
});

app.post('')

app.listen(3000, () => {
    console.log("Backend is running on port 3000!");
});


