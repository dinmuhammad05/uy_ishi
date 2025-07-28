import { createTransport } from "nodemailer";
import config from "../config/index.js";

export const sendToOTP = (mail, otp) =>{
const transporter = createTransport({
    port:config.Mail.MAIL_PORT,
    host:config.Mail.MAIL_HOST,
    auth:{
        user:config.Mail.MAIL_USER,
        pass:config.Mail.MAIL_PASS
    },
    secure:false,
})
const mailOptions = {
    from: config.Mail.MAIL_USER,
    to: mail,
    subject:'Assalamu alaykum',
    text: otp
}
transporter.sendMail(mailOptions, function (err, info){
    if (err) {
        console.log(err);
        
    }else{
        console.log(info);
        
    }
})
}