const invitationQueue = require('./invitationQueue');
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

invitationQueue.process('sendEmail', async(job) => {
    const {email, token, first_name, last_name, message} = job.data;

    try{
        await transporter.sendMail({
            from: 'Keydevs Technologies',
            to: email,
            subject: 'Interview Invitation',
            html: `
                <p>Hi ${first_name} ${last_name},</p>
                <p>${message}</p>
                <p><a href="https://keydevs.com/interview/${token}">Click here to join the interview</a></p>`,
        })

    }catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        throw error;
  }
})
