import mongoose, { Schema, Document, Model } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Color } from '~/globals';

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
        unique: true,
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


// Static method to get avg od tuitions
CourseSchema.static('getAverageCost', async function (this: Model<Document, {}>, bootcampId: string) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {

        if (obj[0]) {
            await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10) * 10
            })
        } else {
            await this.model('Bootcamp').updateOne(
                { _id: bootcampId },
                { $unset: { averageCost: '' } }
            );
        }

    } catch (error) {
        console.error(error)
    }
});

// Call getAverageCost after save
CourseSchema.post<Document>('save', async function (this: any) {
    await this.constructor.getAverageCost(this.bootcamp)
})


// Call getAverageCost before save
CourseSchema.post('remove', async function (this: any) {
    await this.constructor.getAverageCost(this.bootcamp);
})

export default mongoose.model('Course', CourseSchema)