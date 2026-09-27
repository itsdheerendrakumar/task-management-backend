import {Schema, model} from 'mongoose';

export interface Chat {
    _id: any;
    type: "private" | "group";
    name?: string;
    created_by?: any;
    image_url?: string;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<Chat>({
    type: { 
        type: String, 
        enum: ['private', 'group'], 
        required: true 
    },
    name: { 
        type: String, 
        trim: true 
    },
    created_by: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
    },
    image_url: { 
        type: String, 
        trim: true 
    }
}, {timestamps: true});

export default model('Chat', chatSchema);