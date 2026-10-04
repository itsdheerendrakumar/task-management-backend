import {Schema, model} from 'mongoose';

interface ChatParticipant {
    _id: any;
    chat_id: any;
    user_id: any;
    last_read_at: Date;
    unread_count: number;
    createdAt: Date;
    updatedAt: Date;
}

const chatParticipantSchema = new Schema<ChatParticipant>({
    chat_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chat', 
        required: true 
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    last_read_at: {
        type: Date
    },
    unread_count: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

export default model('ChatParticipant', chatParticipantSchema);