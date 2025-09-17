const nodemailer = require("nodemailer");
const { SmtpConfig } = require("../config/config");
class EmailService {
  constructor() {
    try {
      const transPortObj = {
        host: SmtpConfig.host,
        port: SmtpConfig.port,
        secure: false,
        auth: {
          user: SmtpConfig.user,
          pass: SmtpConfig.password,
        },
      };
      console.log('transportObj: ', transPortObj);
      this.transporter = nodemailer.createTransport(transPortObj);
    } catch (exception) {
      console.log("exception in createTransport");
    }
  }

  sendMail = async ({ to, subject = "", text = "", html = "" }) => {
    try {
      return await this.transporter.sendMail({
        to,
        subject,
        html,
      });
    } catch (exception) {
      console.log("exception in sendMail");
      throw exception;
    }
  };
}

module.exports = new EmailService();
