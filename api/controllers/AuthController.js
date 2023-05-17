const User = require('../entities/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {transport} = require("../utilities");
const crypto = require('node:crypto');
const hash = crypto.createHash('sha256');

const authenticate = (req, res) => {
    return User.findOne({email: req.body.email, deletedAt: null}).then((userInfo) => {
        if(userInfo == undefined){
            return res.sendStatus(401).json({status: "error", message: "Authentication failed", token: null, user: null});
        }
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
            const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: process.env.JWT_EXPIRE_TIME});
            return res.cookie("accessToken", token, {httpOnly: true, secure: true})
                .json({status: "success", message: "Authenticated", accessToken: token, user: userInfo});
        } else {
            return res.sendStatus(401).json({status: "error", message: "Authentication failed", token: null, user: null});
        }
    });
};
const logout = (req, res) => {
    return res.clearCookie("access_token")
        .sendStatus(200)
        .json({ message: "Successfully logged out" });
};
const forgot = (req, res) => console.log('forgot');
const reset = (req, res) => console.log('reset')
const changePassword = (req, res) => console.log('change password.');
const verify = (req, res) => console.log('email confirmation');
const register = (req, res) => {
    let userBody = req.body;
    userBody.emailConfirmation = bcrypt.hashSync(`${userBody.email}-${userBody.name}-${Date.now()}`, 10);
    return User.create(userBody).then((user) => {
        if(user) {
            transport.sendMail({
                from: 'todo@todemo.io',
                to: user.email,
                subject: 'Welcome to ToDo Guys',
                text: `<p>Hello ${user.name},</p>` +
                    `<p>Thanks for registering to our tasks management platform.</p>` +
                    `<p>Please confirm your email by <a href="${process.env.APP_URL}/auth/email/confirm/${user.emailConfirmation}">clicking here</a></p>` +
                    `<br>` +
                    `Best wishes,` +
                    `ToDo Guys.`
            });
            const {password, ...data} = user._doc;
            return res.send({status: 'success', message: 'Registration successfully', data});
        }
        })
        .catch((err) => res.sendStatus(500));
};
const authGate = (req, res, next) => {
    jwt.verify(req.headers['authorization'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.sendStatus(401);
        } else {
            req.body.userId = decoded.id;
            next();
        }
    });

};

module.exports = {
    forgot,
    reset,
    changePassword,
    register,
    verify,
    authenticate,
    authGate
}
