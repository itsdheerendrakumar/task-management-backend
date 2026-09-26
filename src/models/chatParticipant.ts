import {Schema, model} from 'mongoose';

interface ChatParticipant {
    _id: any;
    chat_id: any;
    user_id: any;
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
}, {timestamps: true});

export default model('ChatParticipant', chatParticipantSchema);