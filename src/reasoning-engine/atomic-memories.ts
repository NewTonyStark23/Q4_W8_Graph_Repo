/**
 * QWEN4 REASONING ENGINE - ATOMIC MEMORIES
 * 
 * Composable, hashable reasoning units for tools, agents, and capabilities.
 * Each atomic memory is a self-contained unit that can be combined with others.
 */

import { AtomicMemory } from './types';

export const atomicMemories: AtomicMemory[] = [
  // ============================================
  // PREDICTION & PATTERN RECOGNITION (15 memories)
  // ============================================
  {
    id: 'sliding-window-encoder',
    hash: 'sha256:a1b2c3d4e5f6',
    name: 'Sliding Window Encoder',
    category: 'tool',
    capability: 'Extract sliding windows from time-series data',
    inputs: [
      { id: 'time-series', name: 'Time Series', type: 'array', required: true, description: 'Input time-series data' }
    ],
    outputs: [
      { id: 'windows', name: 'Windows', type: 'array', required: true, description: 'Array of sliding windows' }
    ],
    compositionRules: [
      { canComposeWith: ['multi-head-attention', 'probability-distribution-generator'], compositionType: 'chain' }
    ],
    resourceFootprint: 128,
    learningState: {
      weight: 0.95,
      confidence: 0.98,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.96
  },
  {
    id: 'multi-head-attention',
    hash: 'sha256:b2c3d4e5f6g7',
    name: 'Multi-Head Attention',
    category: 'tool',
    capability: 'Apply multi-head attention mechanism',
    inputs: [
      { id: 'input', name: 'Input', type: 'array', required: true, description: 'Input sequence' }
    ],
    outputs: [
      { id: 'attention-output', name: 'Attention Output', type: 'array', required: true, description: 'Attention-weighted output' }
    ],
    compositionRules: [
      { canComposeWith: ['sliding-window-encoder', 'probability-distribution-generator'], compositionType: 'chain' }
    ],
    resourceFootprint: 512,
    learningState: {
      weight: 0.93,
      confidence: 0.97,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.94
  },
  {
    id: 'probability-distribution-generator',
    hash: 'sha256:c3d4e5f6g7h8',
    name: 'Probability Distribution Generator',
    category: 'tool',
    capability: 'Generate probability distributions over future values',
    inputs: [
      { id: 'features', name: 'Features', type: 'array', required: true, description: 'Input features' }
    ],
    outputs: [
      { id: 'distribution', name: 'Distribution', type: 'distribution', required: true, description: 'Probability distribution' }
    ],
    compositionRules: [
      { canComposeWith: ['multi-head-attention', 'confidence-calculator'], compositionType: 'chain' }
    ],
    resourceFootprint: 256,
    learningState: {
      weight: 0.92,
      confidence: 0.96,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.93
  },
  {
    id: 'confidence-calculator',
    hash: 'sha256:d4e5f6g7h8i9',
    name: 'Confidence Calculator',
    category: 'tool',
    capability: 'Calculate confidence scores for predictions',
    inputs: [
      { id: 'prediction', name: 'Prediction', type: 'distribution', required: true, description: 'Prediction distribution' }
    ],
    outputs: [
      { id: 'confidence', name: 'Confidence', type: 'number', required: true, description: 'Confidence score 0-1' }
    ],
    compositionRules: [
      { canComposeWith: ['probability-distribution-generator', 'ensemble-voter'], compositionType: 'chain' }
    ],
    resourceFootprint: 64,
    learningState: {
      weight: 0.94,
      confidence: 0.97,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.95
  },
  {
    id: 'ensemble-voter',
    hash: 'sha256:e5f6g7h8i9j0',
    name: 'Ensemble Voter',
    category: 'tool',
    capability: 'Combine multiple model predictions via weighted voting',
    inputs: [
      { id: 'predictions', name: 'Predictions', type: 'array', required: true, description: 'Array of model predictions' }
    ],
    outputs: [
      { id: 'ensemble-prediction', name: 'Ensemble Prediction', type: 'distribution', required: true, description: 'Combined prediction' }
    ],
    compositionRules: [
      { canComposeWith: ['confidence-calculator'], compositionType: 'chain' }
    ],
    resourceFootprint: 192,
    learningState: {
      weight: 0.91,
      confidence: 0.95,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.92
  },
  {
    id: 'attention-pattern-detector',
    hash: 'sha256:f6g7h8i9j0k1',
    name: 'Attention Pattern Detector',
    category: 'tool',
    capability: 'Detect patterns using attention mechanisms',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Input data' }
    ],
    outputs: [
      { id: 'patterns', name: 'Patterns', type: 'array', required: true, description: 'Detected patterns' }
    ],
    compositionRules: [
      { canComposeWith: ['clustering-engine', 'anomaly-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 384,
    learningState: {
      weight: 0.90,
      confidence: 0.94,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.91
  },
  {
    id: 'clustering-engine',
    hash: 'sha256:g7h8i9j0k1l2',
    name: 'Clustering Engine',
    category: 'tool',
    capability: 'Cluster data points using various algorithms',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to cluster' }
    ],
    outputs: [
      { id: 'clusters', name: 'Clusters', type: 'array', required: true, description: 'Cluster assignments' }
    ],
    compositionRules: [
      { canComposeWith: ['attention-pattern-detector', 'anomaly-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 256,
    learningState: {
      weight: 0.89,
      confidence: 0.93,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.90
  },
  {
    id: 'anomaly-detector',
    hash: 'sha256:h8i9j0k1l2m3',
    name: 'Anomaly Detector',
    category: 'tool',
    capability: 'Detect anomalies in data',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to analyze' }
    ],
    outputs: [
      { id: 'anomalies', name: 'Anomalies', type: 'array', required: true, description: 'Detected anomalies' }
    ],
    compositionRules: [
      { canComposeWith: ['attention-pattern-detector', 'clustering-engine'], compositionType: 'parallel' }
    ],
    resourceFootprint: 192,
    learningState: {
      weight: 0.92,
      confidence: 0.96,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.93
  },
  {
    id: 'frequency-analyzer',
    hash: 'sha256:i9j0k1l2m3n4',
    name: 'Frequency Analyzer',
    category: 'tool',
    capability: 'Analyze frequency components in data',
    inputs: [
      { id: 'signal', name: 'Signal', type: 'array', required: true, description: 'Input signal' }
    ],
    outputs: [
      { id: 'frequencies', name: 'Frequencies', type: 'array', required: true, description: 'Frequency components' }
    ],
    compositionRules: [
      { canComposeWith: ['attention-pattern-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 128,
    learningState: {
      weight: 0.88,
      confidence: 0.92,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.89
  },
  {
    id: 'multi-scale-encoder',
    hash: 'sha256:j0k1l2m3n4o5',
    name: 'Multi-Scale Encoder',
    category: 'tool',
    capability: 'Encode data at multiple time scales',
    inputs: [
      { id: 'time-series', name: 'Time Series', type: 'array', required: true, description: 'Time-series data' }
    ],
    outputs: [
      { id: 'multi-scale-encoding', name: 'Multi-Scale Encoding', type: 'object', required: true, description: 'Encoded data at multiple scales' }
    ],
    compositionRules: [
      { canComposeWith: ['seasonal-decomposer', 'cycle-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 384,
    learningState: {
      weight: 0.91,
      confidence: 0.95,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.92
  },
  {
    id: 'seasonal-decomposer',
    hash: 'sha256:k1l2m3n4o5p6',
    name: 'Seasonal Decomposer',
    category: 'tool',
    capability: 'Decompose time-series into seasonal components',
    inputs: [
      { id: 'time-series', name: 'Time Series', type: 'array', required: true, description: 'Time-series data' }
    ],
    outputs: [
      { id: 'seasonal-components', name: 'Seasonal Components', type: 'object', required: true, description: 'Decomposed seasonal components' }
    ],
    compositionRules: [
      { canComposeWith: ['multi-scale-encoder', 'temporal-attention'], compositionType: 'chain' }
    ],
    resourceFootprint: 256,
    learningState: {
      weight: 0.90,
      confidence: 0.94,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.91
  },
  {
    id: 'cycle-detector',
    hash: 'sha256:l2m3n4o5p6q7',
    name: 'Cycle Detector',
    category: 'tool',
    capability: 'Detect cyclic patterns in data',
    inputs: [
      { id: 'time-series', name: 'Time Series', type: 'array', required: true, description: 'Time-series data' }
    ],
    outputs: [
      { id: 'cycles', name: 'Cycles', type: 'array', required: true, description: 'Detected cycles' }
    ],
    compositionRules: [
      { canComposeWith: ['multi-scale-encoder', 'temporal-attention'], compositionType: 'chain' }
    ],
    resourceFootprint: 192,
    learningState: {
      weight: 0.89,
      confidence: 0.93,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.90
  },
  {
    id: 'temporal-attention',
    hash: 'sha256:m3n4o5p6q7r8',
    name: 'Temporal Attention',
    category: 'tool',
    capability: 'Apply attention over temporal sequences',
    inputs: [
      { id: 'sequence', name: 'Sequence', type: 'array', required: true, description: 'Temporal sequence' }
    ],
    outputs: [
      { id: 'temporal-embeddings', name: 'Temporal Embeddings', type: 'array', required: true, description: 'Attention-weighted embeddings' }
    ],
    compositionRules: [
      { canComposeWith: ['seasonal-decomposer', 'cycle-detector'], compositionType: 'chain' }
    ],
    resourceFootprint: 512,
    learningState: {
      weight: 0.93,
      confidence: 0.97,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.94
  },
  {
    id: 'statistical-anomaly-detector',
    hash: 'sha256:n4o5p6q7r8s9',
    name: 'Statistical Anomaly Detector',
    category: 'tool',
    capability: 'Detect anomalies using statistical methods',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to analyze' }
    ],
    outputs: [
      { id: 'statistical-anomalies', name: 'Statistical Anomalies', type: 'array', required: true, description: 'Detected anomalies' }
    ],
    compositionRules: [
      { canComposeWith: ['isolation-forest', 'autoencoder-anomaly-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 128,
    learningState: {
      weight: 0.91,
      confidence: 0.95,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.92
  },
  {
    id: 'isolation-forest',
    hash: 'sha256:o5p6q7r8s9t0',
    name: 'Isolation Forest',
    category: 'tool',
    capability: 'Detect anomalies using isolation forest algorithm',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to analyze' }
    ],
    outputs: [
      { id: 'isolation-anomalies', name: 'Isolation Anomalies', type: 'array', required: true, description: 'Detected anomalies' }
    ],
    compositionRules: [
      { canComposeWith: ['statistical-anomaly-detector', 'autoencoder-anomaly-detector'], compositionType: 'parallel' }
    ],
    resourceFootprint: 256,
    learningState: {
      weight: 0.90,
      confidence: 0.94,
      lastUpdated: Date.now(),
      updateHistory: []
    },
    version: '1.0.0',
    createdAt: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
    successRate: 0.91
  }
];

// Continue with remaining atomic memories...
// WEB (10), CODE (15), TRADING (15), AUTOMATION (10), VOICE (15),
// EVOLUTION (10), PERSONALIZATION (10), ETHICS (5), INTERACTION (5),
// OPEN-SYSTEMS (8), GENERATION (10), NOTIFICATION (3)
// Plus CORE (15), MEMORY (20), ROUTING (20), REASONING (25),
// MULTIMODAL (15), OPTIMIZATION (8), ADAPTATION (10), TOOLS (20), TRAINING (25)

export const totalAtomicMemories = atomicMemories.length;
export const memoryCategories = [...new Set(atomicMemories.map(m => m.category))];
