import mongoose, { Schema } from 'mongoose';

export interface ISession {
  id?: string;
  _id: string; // We use UUID string custom id for sessions
  user_id: mongoose.Types.ObjectId | string | any;
  refresh_token: string;
  expires_at: Date;
}

const SessionSchema = new Schema<ISession>({
  _id: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true }
}, {
  timestamps: false,
  _id: false
});

SessionSchema.virtual('id').get(function() {
  return this._id;
});

SessionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
