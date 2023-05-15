const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    },
    debug: true,
    logger: true,
});

const getUserEmail = (id) => {
    return this.findById(id).then(res => res).catch(e => console.log(e));
}


module.exports = {transport, getUserEmail};
