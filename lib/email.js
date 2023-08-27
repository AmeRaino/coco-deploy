let nodemailer = require('nodemailer');
let { host, port, user, pass } = require('../config/mailer');

module.exports.sendMail = ({ from, to, subject, body }) => {
	return new Promise((resolve, reject) => {
		if (!to) { return reject(new Error('invalid mail receiver')); }
		if (!subject) { return reject(new Error('invalid mail subject')); }
		if (!body) { return reject(new Error('invalid mail content')); }
		let mailHostConfig = {
			host,
			auth: {
				user,
				pass
			},
			tls: { rejectUnauthorized: false }
		};
		var transporter = nodemailer.createTransport(mailHostConfig);
		var mailOption = { from: !!from ? from : '"CoCo Notification" <' + user + '>', to, subject, html: body };
		transporter.sendMail(mailOption, (error, response) => {
			if (error) {
				// console.log("EMAIL ERR: ", error);
				reject(error);
			} else {
				// console.log("EMAIL RES: ", response);
				resolve(response);
			}
		});
		transporter.close();
	});
};