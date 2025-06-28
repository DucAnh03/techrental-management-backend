import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });
        
        if (!user) {
            // Tạo mật khẩu ngẫu nhiên cho user Google
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const passwordHash = await bcrypt.hash(randomPassword, 12);
            
            // Tạo user mới với thông tin từ Google
            user = await User.create({
                name: profile.displayName,
                email: email,
                password: passwordHash,
                phone: profile.phoneNumbers?.[0]?.value || '',
                roles: ['renter'],
                avatar: profile.photos?.[0]?.value || '',
                identityVerification: {
                    status: 'verified', // Tự động verified khi login bằng Google
                    verifiedAt: new Date(),
                },
                isActive: true,
            });
        } else {
            // Nếu user đã tồn tại, cập nhật thông tin và đảm bảo verified
            if (user.identityVerification?.status !== 'verified') {
                user.identityVerification = {
                    ...user.identityVerification,
                    status: 'verified',
                    verifiedAt: new Date(),
                };
                await user.save();
            }
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
