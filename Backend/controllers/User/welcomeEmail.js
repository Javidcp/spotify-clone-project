const nodemailer = require('nodemailer');
const { errorHandling } = require('../../helper/errorMiddleware');

exports.sendTableStyledWelcomeEmail = errorHandling(async(toEmail) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Spotify</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  min-height: 100vh; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header with Spotify-style gradient -->
                <tr>
                    <td style="background: linear-gradient(135deg, #1db954 0%, #1ed760 50%, #1aa34a 100%); padding: 40px 30px; text-align: center; position: relative;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center;">
                                    <!-- Spotify-like icon -->
                                    <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                                        <span style="font-size: 40px; color: white; text-align: center">🎵</span>
                                    </div>
                                    <h1 style="margin: 0; font-size: 32px; color: black; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        Welcome to Our Spotify!
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 300;">
                                        Your music journey starts here
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <h2 style="color: #191414; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                        Hello Music Lover! 👋
                                    </h2>
                                    <p style="color: #535353; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for signing up to <strong style="color: #1db954;">Our Spotify</strong>. We're thrilled to have you onboard and can't wait for you to discover your next favorite song!
                                    </p>
                                    
                                    <!-- Feature cards -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td style="padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; border-left: 4px solid #1db954;">
                                                <h3 style="color: #191414; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                                                    🚀 Here's what you can do next:
                                                </h3>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #535353; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #1db954; font-weight: bold;">🎧</span> 
                                                            <strong>Explore our features</strong> - Discover millions of songs and podcasts
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #535353; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #1db954; font-weight: bold;">👤</span> 
                                                            <strong>Customize your profile</strong> - Make your music space uniquely yours
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #535353; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #1db954; font-weight: bold;">🤝</span> 
                                                            <strong>Connect with others</strong> - Share playlists and discover new music together
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #535353; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                                        If you have any questions, just reply to this email — we're here to help! 💚
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                        <p style="color: #999; font-size: 14px; margin: 20px 0 0 0; line-height: 1.4;">
                            Ready to dive into your personalized music experience?
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; text-align: center;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding-bottom: 20px;">
                                    <p style="color: #191414; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                        Follow us for the latest updates
                                    </p>
                                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                        <tr>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1db954; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">📘</a>
                                            </td>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1db954; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">🐦</a>
                                            </td>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1db954; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">📷</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #191414 0%, #2d2d2d 100%); text-align: center; color: #b3b3b3;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding-bottom: 15px;">
                                    <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                        © 2025 Our Spotify, All rights reserved.<br>
                                        <span style="color: #1db954;">Music for everyone, everywhere.</span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center; padding-top: 15px; border-top: 1px solid #404040;">
                                    <p style="margin: 0; font-size: 12px; color: #808080;">
                                        You received this email because you signed up for Our Spotify.<br>
                                        <a href="#" style="color: #1db954; text-decoration: none;">Unsubscribe</a> | 
                                        <a href="#" style="color: #1db954; text-decoration: none;">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

    const mailOptions = {
        from: '"Our Spotify" <spotify@gmail.com>',
        to: toEmail,
        subject: 'Welcome to Our Spotify! 🎉',
        html: htmlContent
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Table styled welcome email sent:', info.response);
    } catch (error) {
        console.log('Error sending table styled welcome email:', error);
    }
})