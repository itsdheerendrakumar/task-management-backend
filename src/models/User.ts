import mongoose, { Schema } from 'mongoose';

export interface IUser {
  id?: string;
  _id?: any;
  email: string;
  name?: string;
  role: 'admin' | 'projectManager' | 'client' | 'member';
  password?: string;
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: ['admin', 'projectManager', 'client', 'member'], default: 'member' },
  password: { type: String, required: true },
  profile_image: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
