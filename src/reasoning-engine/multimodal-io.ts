/**
 * QWEN4 REASONING ENGINE - MULTI-MODAL I/O
 * 
 * Handles all input/output pathways:
 * - Input: microphone, camera, screen, images, text, files
 * - Output: speakers, display, files, network
 * - Processing pipelines for each modality
 */

import { InputPathway, OutputPathway, ProcessingStep } from './types';

export const inputPathways: InputPathway[] = [
  // ============================================
  // AUDIO INPUT
  // ============================================
  {
    id: 'microphone-input',
    type: 'microphone',
    processingPipeline: [
      {
        id: 'audio-capture',
        name: 'Audio Capture',
        operation: 'capture-audio-stream',
        parameters: { sampleRate: 44100, channels: 1, bitDepth: 16 }
      },
      {
        id: 'noise-reduction',
        name: 'Noise Reduction',
        operation: 'reduce-background-noise',
        atomicMemoryId: 'noise-reduction-memory',
        parameters: { algorithm: 'spectral-subtraction' }
      },
      {
        id: 'speech-to-text',
        name: 'Speech to Text',
        operation: 'transcribe-speech',
        atomicMemoryId: 'stt-memory',
        parameters: { language: 'auto', model: 'whisper-large-v3' }
      },
      {
        id: 'text-normalization',
        name: 'Text Normalization',
        operation: 'normalize-text',
        parameters: { lowercase: false, removePunctuation: false }
      }
    ],
    resourceRequirements: {
      ram: { min: 256, max: 1024 },
      cpu: { min: 20, max: 60 },
      gpu: { min: 10, max: 50 },
      vram: { min: 256, max: 1024 },
      disk: { min: 50, max: 200 },
      latency: { min: 100, max: 500 },
      priority: 'high'
    },
    outputFormat: 'text'
  },

  // ============================================
  // VISUAL INPUT
  // ============================================
  {
    id: 'camera-input',
    type: 'camera',
    processingPipeline: [
      {
        id: 'video-capture',
        name: 'Video Capture',
        operation: 'capture-video-stream',
        parameters: { resolution: '1080p', fps: 30 }
      },
      {
        id: 'frame-extraction',
        name: 'Frame Extraction',
        operation: 'extract-key-frames',
        parameters: { interval: 1 } // 1 frame per second
      },
      {
        id: 'face-detection',
        name: 'Face Detection',
        operation: 'detect-faces',
        atomicMemoryId: 'face-detection-memory',
        parameters: { model: 'retinaface' }
      },
      {
        id: 'emotion-recognition',
        name: 'Emotion Recognition',
        operation: 'recognize-emotions',
        atomicMemoryId: 'emotion-recognition-memory',
        parameters: { emotions: ['happy', 'sad', 'angry', 'surprised', 'neutral'] }
      },
      {
        id: 'scene-understanding',
        name: 'Scene Understanding',
        operation: 'understand-scene',
        atomicMemoryId: 'scene-understanding-memory',
        parameters: { model: 'clip-vit-large' }
      }
    ],
    resourceRequirements: {
      ram: { min: 512, max: 2048 },
      cpu: { min: 30, max: 70 },
      gpu: { min: 40, max: 90 },
      vram: { min: 1024, max: 4096 },
      disk: { min: 100, max: 500 },
      latency: { min: 200, max: 1000 },
      priority: 'high'
    },
    outputFormat: 'object'
  },
  {
    id: 'screen-input',
    type: 'screen',
    processingPipeline: [
      {
        id: 'screen-capture',
        name: 'Screen Capture',
        operation: 'capture-screen',
        parameters: { resolution: 'native', fps: 10 }
      },
      {
        id: 'ocr-processing',
        name: 'OCR Processing',
        operation: 'extract-text-from-screen',
        atomicMemoryId: 'ocr-memory',
        parameters: { languages: ['en', 'es', 'fr', 'de', 'zh'] }
      },
      {
        id: 'ui-element-detection',
        name: 'UI Element Detection',
        operation: 'detect-ui-elements',
        atomicMemoryId: 'ui-detection-memory',
        parameters: { elements: ['buttons', 'inputs', 'text', 'images'] }
      },
      {
        id: 'context-extraction',
        name: 'Context Extraction',
        operation: 'extract-screen-context',
        parameters: { includeMetadata: true }
      }
    ],
    resourceRequirements: {
      ram: { min: 384, max: 1536 },
      cpu: { min: 25, max: 65 },
      gpu: { min: 30, max: 80 },
      vram: { min: 512, max: 2048 },
      disk: { min: 75, max: 300 },
      latency: { min: 150, max: 800 },
      priority: 'medium'
    },
    outputFormat: 'object'
  },
  {
    id: 'image-input',
    type: 'image',
    processingPipeline: [
      {
        id: 'image-loading',
        name: 'Image Loading',
        operation: 'load-image',
        parameters: { maxWidth: 4096, maxHeight: 4096 }
      },
      {
        id: 'image-preprocessing',
        name: 'Image Preprocessing',
        operation: 'preprocess-image',
        parameters: { normalize: true, resize: true }
      },
      {
        id: 'feature-extraction',
        name: 'Feature Extraction',
        operation: 'extract-image-features',
        atomicMemoryId: 'image-feature-memory',
        parameters: { model: 'clip-vit-large', dimensions: 768 }
      },
      {
        id: 'object-detection',
        name: 'Object Detection',
        operation: 'detect-objects',
        atomicMemoryId: 'object-detection-memory',
        parameters: { model: 'yolov8', confidence: 0.5 }
      },
      {
        id: 'image-captioning',
        name: 'Image Captioning',
        operation: 'generate-image-caption',
        atomicMemoryId: 'captioning-memory',
        parameters: { model: 'blip-large' }
      }
    ],
    resourceRequirements: {
      ram: { min: 512, max: 2048 },
      cpu: { min: 30, max: 70 },
      gpu: { min: 40, max: 90 },
      vram: { min: 1024, max: 4096 },
      disk: { min: 100, max: 500 },
      latency: { min: 200, max: 1000 },
      priority: 'medium'
    },
    outputFormat: 'object'
  },

  // ============================================
  // TEXT INPUT
  // ============================================
  {
    id: 'text-input',
    type: 'text',
    processingPipeline: [
      {
        id: 'text-loading',
        name: 'Text Loading',
        operation: 'load-text',
        parameters: { encoding: 'utf-8' }
      },
      {
        id: 'text-preprocessing',
        name: 'Text Preprocessing',
        operation: 'preprocess-text',
        parameters: { normalize: true, tokenize: true }
      },
      {
        id: 'language-detection',
        name: 'Language Detection',
        operation: 'detect-language',
        atomicMemoryId: 'language-detection-memory',
        parameters: { model: 'fasttext' }
      },
      {
        id: 'sentiment-analysis',
        name: 'Sentiment Analysis',
        operation: 'analyze-sentiment',
        atomicMemoryId: 'sentiment-analysis-memory',
        parameters: { model: 'roberta-large' }
      },
      {
        id: 'entity-extraction',
        name: 'Entity Extraction',
        operation: 'extract-entities',
        atomicMemoryId: 'ner-memory',
        parameters: { model: 'spacy-large' }
      }
    ],
    resourceRequirements: {
      ram: { min: 256, max: 1024 },
      cpu: { min: 20, max: 60 },
      gpu: { min: 20, max: 70 },
      vram: { min: 512, max: 2048 },
      disk: { min: 50, max: 200 },
      latency: { min: 100, max: 500 },
      priority: 'medium'
    },
    outputFormat: 'object'
  },

  // ============================================
  // FILE INPUT
  // ============================================
  {
    id: 'file-input',
    type: 'file',
    processingPipeline: [
      {
        id: 'file-loading',
        name: 'File Loading',
        operation: 'load-file',
        parameters: { supportedTypes: ['pdf', 'docx', 'xlsx', 'csv', 'json'] }
      },
      {
        id: 'file-parsing',
        name: 'File Parsing',
        operation: 'parse-file-content',
        atomicMemoryId: 'file-parser-memory',
        parameters: { extractMetadata: true }
      },
      {
        id: 'content-extraction',
        name: 'Content Extraction',
        operation: 'extract-content',
        parameters: { preserveStructure: true }
      },
      {
        id: 'content-indexing',
        name: 'Content Indexing',
        operation: 'index-content',
        atomicMemoryId: 'indexing-memory',
        parameters: { buildSearchIndex: true }
      }
    ],
    resourceRequirements: {
      ram: { min: 384, max: 1536 },
      cpu: { min: 25, max: 65 },
      gpu: { min: 10, max: 40 },
      vram: { min: 256, max: 1024 },
      disk: { min: 100, max: 500 },
      latency: { min: 200, max: 2000 },
      priority: 'medium'
    },
    outputFormat: 'object'
  }
];

export const outputPathways: OutputPathway[] = [
  // ============================================
  // AUDIO OUTPUT
  // ============================================
  {
    id: 'speakers-output',
    type: 'speakers',
    processingPipeline: [
      {
        id: 'text-processing',
        name: 'Text Processing',
        operation: 'process-text-for-speech',
        parameters: { normalize: true }
      },
      {
        id: 'emotion-selection',
        name: 'Emotion Selection',
        operation: 'select-appropriate-emotion',
        atomicMemoryId: 'emotion-generator-memory',
        parameters: { contextAware: true }
      },
      {
        id: 'voice-synthesis',
        name: 'Voice Synthesis',
        operation: 'synthesize-speech',
        atomicMemoryId: 'tts-memory',
        parameters: { voice: 'natural', language: 'auto' }
      },
      {
        id: 'audio-postprocessing',
        name: 'Audio Post-processing',
        operation: 'postprocess-audio',
        parameters: { normalize: true, enhance: true }
      },
      {
        id: 'audio-playback',
        name: 'Audio Playback',
        operation: 'play-audio',
        parameters: { device: 'default' }
      }
    ],
    resourceRequirements: {
      ram: { min: 256, max: 1024 },
      cpu: { min: 20, max: 60 },
      gpu: { min: 10, max: 50 },
      vram: { min: 256, max: 1024 },
      disk: { min: 50, max: 200 },
      latency: { min: 100, max: 500 },
      priority: 'high'
    },
    inputFormat: 'text'
  },

  // ============================================
  // VISUAL OUTPUT
  // ============================================
  {
    id: 'display-output',
    type: 'display',
    processingPipeline: [
      {
        id: 'content-formatting',
        name: 'Content Formatting',
        operation: 'format-content-for-display',
        parameters: { responsive: true }
      },
      {
        id: 'rendering',
        name: 'Rendering',
        operation: 'render-content',
        parameters: { quality: 'high' }
      },
      {
        id: 'display-output',
        name: 'Display Output',
        operation: 'output-to-display',
        parameters: { fullscreen: false }
      }
    ],
    resourceRequirements: {
      ram: { min: 256, max: 1024 },
      cpu: { min: 20, max: 60 },
      gpu: { min: 30, max: 80 },
      vram: { min: 512, max: 2048 },
      disk: { min: 50, max: 200 },
      latency: { min: 50, max: 200 },
      priority: 'high'
    },
    inputFormat: 'any'
  },

  // ============================================
  // IMAGE GENERATION OUTPUT
  // ============================================
  {
    id: 'image-generation-output',
    type: 'display',
    processingPipeline: [
      {
        id: 'prompt-processing',
        name: 'Prompt Processing',
        operation: 'process-image-prompt',
        parameters: { enhance: true }
      },
      {
        id: 'image-generation',
        name: 'Image Generation',
        operation: 'generate-image',
        atomicMemoryId: 'image-generator-memory',
        parameters: { model: 'stable-diffusion-xl', steps: 50 }
      },
      {
        id: 'image-postprocessing',
        name: 'Image Post-processing',
        operation: 'postprocess-image',
        parameters: { upscale: true, enhance: true }
      },
      {
        id: 'image-display',
        name: 'Image Display',
        operation: 'display-image',
        parameters: { format: 'png' }
      }
    ],
    resourceRequirements: {
      ram: { min: 1024, max: 4096 },
      cpu: { min: 30, max: 70 },
      gpu: { min: 60, max: 100 },
      vram: { min: 2048, max: 8192 },
      disk: { min: 200, max: 1000 },
      latency: { min: 5000, max: 30000 },
      priority: 'medium'
    },
    inputFormat: 'text'
  },

  // ============================================
  // VIDEO GENERATION OUTPUT
  // ============================================
  {
    id: 'video-generation-output',
    type: 'display',
    processingPipeline: [
      {
        id: 'prompt-processing',
        name: 'Prompt Processing',
        operation: 'process-video-prompt',
        parameters: { enhance: true }
      },
      {
        id: 'video-generation',
        name: 'Video Generation',
        operation: 'generate-video',
        atomicMemoryId: 'video-generator-memory',
        parameters: { model: 'higgsfield', frames: 24, fps: 24 }
      },
      {
        id: 'video-postprocessing',
        name: 'Video Post-processing',
        operation: 'postprocess-video',
        parameters: { upscale: true, stabilize: true }
      },
      {
        id: 'video-display',
        name: 'Video Display',
        operation: 'display-video',
        parameters: { format: 'mp4' }
      }
    ],
    resourceRequirements: {
      ram: { min: 2048, max: 8192 },
      cpu: { min: 40, max: 90 },
      gpu: { min: 80, max: 100 },
      vram: { min: 4096, max: 16384 },
      disk: { min: 500, max: 2000 },
      latency: { min: 30000, max: 300000 },
      priority: 'low'
    },
    inputFormat: 'text'
  },

  // ============================================
  // FILE OUTPUT
  // ============================================
  {
    id: 'file-output',
    type: 'file',
    processingPipeline: [
      {
        id: 'content-formatting',
        name: 'Content Formatting',
        operation: 'format-content-for-file',
        parameters: { format: 'auto' }
      },
      {
        id: 'file-generation',
        name: 'File Generation',
        operation: 'generate-file',
        parameters: { compress: false }
      },
      {
        id: 'file-saving',
        name: 'File Saving',
        operation: 'save-file',
        parameters: { overwrite: false }
      }
    ],
    resourceRequirements: {
      ram: { min: 128, max: 512 },
      cpu: { min: 10, max: 40 },
      gpu: { min: 0, max: 10 },
      vram: { min: 0, max: 100 },
      disk: { min: 100, max: 1000 },
      latency: { min: 100, max: 1000 },
      priority: 'low'
    },
    inputFormat: 'any'
  },

  // ============================================
  // NETWORK OUTPUT
  // ============================================
  {
    id: 'network-output',
    type: 'network',
    processingPipeline: [
      {
        id: 'content-serialization',
        name: 'Content Serialization',
        operation: 'serialize-content',
        parameters: { format: 'json' }
      },
      {
        id: 'network-transmission',
        name: 'Network Transmission',
        operation: 'transmit-over-network',
        parameters: { protocol: 'https', compress: true }
      }
    ],
    resourceRequirements: {
      ram: { min: 128, max: 512 },
      cpu: { min: 10, max: 40 },
      gpu: { min: 0, max: 10 },
      vram: { min: 0, max: 100 },
      disk: { min: 50, max: 200 },
      latency: { min: 100, max: 5000 },
      priority: 'medium'
    },
    inputFormat: 'any'
  }
];

export const totalInputPathways = inputPathways.length;
export const totalOutputPathways = outputPathways.length;
