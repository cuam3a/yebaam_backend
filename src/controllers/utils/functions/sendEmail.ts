import { auth } from "../../../config/emailConfig";
import { InfotoEmail } from "../interfaces/infoToEmail.interface";

const nodemailer = require("nodemailer");

class SendMail {

    public async sendMail(infomailUser: InfotoEmail): Promise<any> {
        return new Promise((Resolve, reject) => {

            try {

                const transporter = nodemailer.createTransport({
                    // host: 'smtpout.secureserver.net',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secureConnection: true,
                    tls: {
                        ciphers: 'SSLv3'
                    },
                    auth: auth
                });

                const mailOptions = {
                    from: "tudotspot@gmail.com", // sender address
                    to: infomailUser.email, // list of receivers
                    subject: "Petición de registro", // Subject line
                    html: `
                    <div style="padding: 1rem;">
                        <h2> Hola!</h2>
        
                        <p> <strong>Tu código de verificación es: </strong> <h1> ${infomailUser.code} </h1> </p>
                    </div>
                        `
                };

                transporter.sendMail(mailOptions, function (err: any, info: any) {
                    if (err) {
                        reject({ error: err });
                    }
                    else {
                        Resolve({
                            error: null,
                            data: "email was send"
                        });
                    }
                });
            } catch (error) {
                
                reject(error);

            }
        })
    }
}

export const sendEmail = new SendMail();