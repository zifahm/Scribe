import * as nodemailer from "nodemailer";

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

export const sendEmailToUser = (
  email: string,
  link: string,
  linkText: string
) => {
  nodemailer.createTestAccount(() => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "apikey", // generated ethereal user
        pass: process.env.SENDGRID_API_KEY

        // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: "<foo@example.com>", // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Hello world?</b>
      <a href='${link}'> ${linkText} </a>
      ` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    });
  });
};
