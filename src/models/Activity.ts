import mongoose, { Schema } from 'mongoose';

export interface IActivity {
  id?: string;
  _id?: any;
  action: string;
  message: string;
  task_id?: string | undefined;
  subtask_id?: string | undefined;
  meta_data?: any | undefined;
  performed_by: mongoose.Types.ObjectId | string | any;
  created_at?: Date | undefined;
}

const ActivitySchema = new Schema<IActivity>({
  action: { type: String, required: true },
  message: { type: String, required: true },
  task_id: { type: String },
  subtask_id: { type: String },
  meta_data: { type: Schema.Types.Mixed },
  performed_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

ActivitySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ActivitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
