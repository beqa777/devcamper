import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { geocoder } from '~/utils/geocoder';

interface BootcampType extends Document {
    name: string,
    slug: string,
    description: string,
    website: string,
    phone: Number,
    email: string,
    address?: string,
    location: {
        type: string,
        coordinates: any[],
        formattedAddress?: string,
        street?: string,
        city?: string,
        state?: string,
        zipcode?: string,
        country?: string
    },
    careers: string,
    averageRating: string,
    averageCost: string,
    photo: string,
    housing: string,
    jobAssistance: string,
    jobGuarantee: string,
    acceptGi: string,
    createdAt: Date
}

const BootcampSchema: Schema<BootcampType> = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add name'],
        unique: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

type BootcampSchemaType = typeof BootcampSchema;

// Create bootcamp slug from name
BootcampSchema.pre<BootcampType>('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Geocode & create location field
BootcampSchema.pre<BootcampType>('save', async function (next) {
    const loc = await geocoder.geocode(''+this.address);
    const info = loc[0];
    
    this.location = {
        type: 'Point',
        coordinates: [info.longitude, info.latitude],
        formattedAddress: info.formattedAddress,
        street: info.streetName,
        city: info.city,
        state: info.state,
        zipcode: info.zipcode,
        country: info.countryCode
    }
    this.address = undefined;
    next();
});

export default mongoose.model('Bootcamp', BootcampSchema);
