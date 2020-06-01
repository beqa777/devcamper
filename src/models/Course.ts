import mongoose, { Schema, Document, Types } from 'mongoose';
import { ObjectID } from 'mongodb';

interface CourseType extends Document {
    title: string,
    description: string,
    weeks: string,
    tuition: number,
    minimumSkill: number,
    scholarshipAvailable: number,
    createdAt: number
}

const CourseSchema = new Schema<CourseType>({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add course title']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add course description']
    },
    weeks: {
        type: String,
        trim: true,
        required: [true, 'Please add course number of weeks']
    },
    tuition: {
        type: Number,
        trim: true,
        required: [true, 'Please add tutor cost']
    },
    minimumSkill: {
        type: String,
        trim: true,
        required: [true, 'Please add minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: ObjectID,
        ref: 'Bootcamp',
        required: true
    }
});

export default mongoose.model('Course', CourseSchema)