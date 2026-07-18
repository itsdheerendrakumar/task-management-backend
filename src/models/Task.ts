import mongoose, { Schema } from 'mongoose';

export interface ITaskParticipant {
  user: mongoose.Types.ObjectId | string | any;
  role: 'admin' | 'projectManager' | 'client' | 'member';
}

export interface ITask {
  id?: string;
  _id?: any;
  name: string;
  description: string;
  deadline: Date;
  notes?: string;
  created_by: mongoose.Types.ObjectId | string | any;
  status: 'pending' | 'in-progress' | 'completed';
  task_participants: ITaskParticipant[];
  created_at?: Date;
  updated_at?: Date;
}

const TaskParticipantSchema = new Schema<ITaskParticipant>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'projectManager', 'client', 'member'], required: true }
}, { _id: false });

const TaskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  notes: { type: String, default: '' },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  task_participants: [TaskParticipantSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

TaskSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

TaskSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
