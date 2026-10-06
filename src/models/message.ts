import { Schema, model } from 'mongoose';

interface message {
    _id: any;
    chat_id: any;
    sender_id: any;
    content: string;
    attachment_public_id: string;
    attachment_format: string;
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
        default: ""
    },
    attachment_public_id: {
        type: String,
        default: ""
    },
    attachment_format: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default model('Message', messageSchema);