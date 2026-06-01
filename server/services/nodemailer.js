import nodemailer from "nodemailer"
import path from "path"

const mailICSFile = async (outputPath) => {

    const fileName = path.basename(outputPath)

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_GMAIL_ACCOUNT,
            pass: process.env.NODEMAILER_GMAIL_PASS_KEY,
        }
    })

    const mailOptions = {
        from: process.env.NODEMAILER_GMAIL_ACCOUNT,
        to: "nathkn9339@gmail.com",
        subject: `Your Time Table event file`,
        text: `Your time table ICS file attatched to this email`,
        
        attachments:[
            {
                filename:`${fileName}`,
                path:`${outputPath}`
            }
        ]
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                console.log(`Email sent: ${info.response}`)
                resolve(info.response)
            }
        })
    })
}

export default mailICSFile