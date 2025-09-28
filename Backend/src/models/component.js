import mongoose from "mongoose";

const componentFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['jsx', 'css', 'js', 'ts', 'tsx', 'scss', 'less', 'json']
  },
  isMain: {
    type: Boolean,
    default: false
  }
});

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  files: [componentFileSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  dependencies: [{
    name: String,
    version: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsqueda optimizada
componentSchema.index({ name: 'text', description: 'text', tags: 'text' });
componentSchema.index({ category: 1 });
componentSchema.index({ createdBy: 1 });
componentSchema.index({ tags: 1 });

export default mongoose.model('Component', componentSchema);
