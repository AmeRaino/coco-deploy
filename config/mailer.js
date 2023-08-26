require('dotenv').config();

module.exports = {
	// host: process.env.HOSTMAIL || "smtp.gmail.com",
	host: process.env.HOSTMAIL || "smtp.zoho.com",
	port: process.env.MAIL_PORT || "465",
	// user: process.env.MAIL_USER || "conmeocon3600@gmail.com",
	user: process.env.MAIL_USER || "infococo@zohomail.com",
	pass: process.env.MAIL_PASSWORD || "Crosstech2021@",
	salt: process.env.SALT || "10",
	exprires_in: process.env.EXPIRES_IN || "12h"
};
