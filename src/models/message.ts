import {Schema, model} from 'mongoose';

interface message {
    _id: any;
    chat_id: any;
    sender_id: any;
    content: string;
    type: "text" | "image" | "video" | "audio" | "file";
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<message>({
    chat_id: { 
        type: Schema.Types.ObjectId,
        ref: 'Chat', 
        required: true 
    },
    sender_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        trim: true, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['text', 'image', 'video', 'audio', 'file'], 
        required: true 
    }
}, {timestamps: true});

export default model('Message', messageSchema);