import mongoose from 'mongoose';

const VoiceTestSubmissionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    originalFilename: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'reviewed', 'completed'],
      default: 'pending',
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

VoiceTestSubmissionSchema.index({ submittedAt: -1 });
VoiceTestSubmissionSchema.index({ phone: 1, email: 1 });

export default mongoose.models.VoiceTestSubmission ||
  mongoose.model('VoiceTestSubmission', VoiceTestSubmissionSchema);

