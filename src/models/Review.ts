import { ObjectID } from 'mongodb';
import mongoose, { Document, Schema, Model } from 'mongoose';

interface ReviewType extends Document {
    title: string,
    text: string,
    rating: number,
    createdAt: string,
    user: string,
    bootcamp: string,
    getAverageRating: Function
}

const ReviewSchema = new Schema<ReviewType>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please add review title'],
        maxlength: 100
    },
    text: {
        type: String,
        trim: true,
        required: [true, 'Please add review text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add rating between 1 and 10']
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: ObjectID,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: ObjectID,
        ref: 'User',
        required: true
    }
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg of rating
ReviewSchema.static('getAverageRating', async function (this: Model<Document, {}>, bootcampId: string) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {

        if (obj[0]) {
            await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageRating: obj[0].averageRating
            })
        } else {
            await this.model('Bootcamp').updateOne(
                { _id: bootcampId },
                { $unset: { averageRating: '' } }
            );
        }

    } catch (error) {
        console.error(error)
    }
});

// Call getAverageCost after save
ReviewSchema.post<Document>('save', async function (this: any) {
    await this.constructor.getAverageRating(this.bootcamp)
})


// Call getAverageCost before save
ReviewSchema.post('remove', async function (this: any) {
    await this.constructor.getAverageRating(this.bootcamp);
})


export default mongoose.model<ReviewType>('Review', ReviewSchema)