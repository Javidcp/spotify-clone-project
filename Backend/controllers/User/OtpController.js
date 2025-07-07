const Otp = require('../../models/Otp');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require("../../models/User")
const jwt = require('jsonwebtoken');
const { createError, errorHandling  } = require("../../helper/errorMiddleware")

exports.sendOTP = errorHandling(async (req, res, next) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

        await Otp.deleteMany({ email });
        await Otp.create({ email, otp: hashedOtp });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="color: #000; font-size: 28px; font-weight: bold; margin: 0;">
                                                        🔐 OTP Verification
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Main Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="text-align: center; padding-bottom: 20px;">
                                                        <h2 style="color: #333333; font-size: 24px; margin: 0 0 10px 0;">
                                                            Your Verification Code
                                                        </h2>
                                                        <p style="color: #666666; font-size: 16px; margin: 0; line-height: 1.5;">
                                                            Use the code below to complete your verification
                                                        </p>
                                                    </td>
                                                </tr>
                                                
                                                <!-- OTP Code Box -->
                                                <tr>
                                                    <td style="text-align: center; padding: 30px 0;">
                                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 12px; padding: 20px;">
                                                            <tr>
                                                                <td style="text-align: center;">
                                                                    <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                                        ${otp}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                
                                                <!-- Expiry Notice -->
                                                <tr>
                                                    <td style="text-align: center; padding-top: 20px;">
                                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px;">
                                                            <tr>
                                                                <td style="text-align: center;">
                                                                    <span style="color: #856404; font-size: 14px; font-weight: 500;">
                                                                        ⏰ This code expires in 5 minutes
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                
                                                <!-- Instructions -->
                                                <tr>
                                                    <td style="text-align: center; padding-top: 30px;">
                                                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.6;">
                                                            If you didn't request this code, please ignore this email.<br>
                                                            For security reasons, do not share this code with anyone.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="color: #999999; font-size: 12px; line-height: 1.5;">
                                                        This is an automated message. Please do not reply to this email.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
            text: `Your OTP is ${otp}. It expires in 5 minutes.`
        };

        console.log("Email:", email);
        console.log("Using Gmail:", process.env.EMAIL_USER);
        console.log("OTP:", otp);

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email', otp });
});

exports.verifyOTP = errorHandling(async (req, res, next) => {
    const { email, otp } = req.body;

        const record = await Otp.findOne({ email });
        if (!record) return next(createError(400, "OTP expired or not found"))

        const isValid = await bcrypt.compare(otp, record.otp);
        if (!isValid) return next(createError(400, "Invalid OTP"))

        let user = await User.findOne({ email });
        if (!user) return next(createError(404, "User not found"))
        if (user && user.isActive === false) return next(createError(403, "Your account has been blocked. Please contact support"))

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        await Otp.deleteMany({ email });
        res.status(200).json({ message: 'OTP verified successfully',token, user });
});
