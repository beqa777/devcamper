import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface UserSchemaType extends Document {
    _id: string,
    name: string,
    email: string,
    role: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpired: number,
    createdAt: string,
    getSignJwtToken: () => string,
    marchPassword: (enteredPassword: string) => Promise<boolean>,
    getResetPasswordToken: Function
}

const UserSchema = new Schema<UserSchemaType>({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre<UserSchemaType>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})



// Sign JWT and return
UserSchema.method('getSignJwtToken', function (this: UserSchemaType) {
    return jwt.sign({ id: this._id }, `${process.env.JWT_SECRET}`, {
        expiresIn: process.env.JWT_EXPIRE
    });
})

// Match user entered password to hashed password in database
UserSchema.method('marchPassword', async function (this: UserSchemaType, enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
});

// Generate and hash token
UserSchema.method('getResetPasswordToken', function (this: UserSchemaType) {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to restPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;
    return resetToken;
});



export default model<UserSchemaType>('User', UserSchema);