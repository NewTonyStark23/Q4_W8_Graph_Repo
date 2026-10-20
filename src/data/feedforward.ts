import { GraphNode, GraphEdge } from './types';

export const feedforwardNodes: GraphNode[] = [
  { id: 'ffn-gate', label: 'MoE Router Gate', category: 'feedforward', section: 'mlp-block', weight: 0.01, confidence: 0.9, source: 'observed', description: 'Top-K routing gate selecting 8 of 128 experts per token', connections: ['ffn-expert', 'ffn-shared'], metadata: { numExperts: 128, topK: 8, activeParams: '22B of 235B' } },
  { id: 'ffn-shared', label: 'Shared Expert (dense)', category: 'feedforward', section: 'mlp-block', weight: 0.04, confidence: 0.92, source: 'observed', description: 'Always-active shared expert providing baseline computation', connections: ['ffn-combine'], metadata: { intermediateSize: 1280, alwaysActive: true } },
  { id: 'ffn-expert', label: 'Routed Experts (SwiGLU)', category: 'feedforward', section: 'mlp-block', weight: 0.35, confidence: 0.88, source: 'observed', description: '128 routed experts with SwiGLU activation, each ~1.7B params', connections: ['ffn-combine'], metadata: { activation: 'swiglu', expertSize: '~1.7B each' } },
  { id: 'ffn-combine', label: 'Expert Combination', category: 'feedforward', section: 'mlp-block', weight: 0.005, confidence: 0.85, source: 'inferred', description: 'Weighted combination of top-K expert outputs with normalization', connections: ['norm-post-ffn'], metadata: { normalization: 'softmax', combination: 'weighted-sum' } },
  { id: 'ffn-dense-layers', label: 'Dense FFN Layers (non-MoE)', category: 'feedforward', section: 'mlp-block', weight: 0.08, confidence: 0.82, source: 'inferred', description: 'Some layers use standard dense MLP for stability', connections: ['norm-post-ffn'], metadata: { layers: 'every-other', intermediateSize: 1280 } },
  { id: 'ffn-norm-type', label: 'RMSNorm Pre-Norm', category: 'normalization', section: 'mlp-block', weight: 0.002, confidence: 0.95, source: 'observed', description: 'Root Mean Square Layer Normalization before each sublayer', connections: ['ffn-gate', 'ffn-expert'], metadata: { type: 'rmsnorm', eps: 1e-6 } },
  { id: 'ffn-load-balance', label: 'Expert Load Balancing Loss', category: 'feedforward', section: 'mlp-block', weight: 0.001, confidence: 0.78, source: 'inferred', description: 'Auxiliary loss ensuring uniform expert utilization', connections: ['ffn-gate'], metadata: { coefficient: 0.01, type: 'switch-transformer' } },
];

export const feedforwardEdges: GraphEdge[] = [
  { from: 'ffn-gate', to: 'ffn-expert', weight: 1.0, type: 'control-flow' },
  { from: 'ffn-gate', to: 'ffn-shared', weight: 0.5, type: 'control-flow' },
  { from: 'ffn-expert', to: 'ffn-combine', weight: 1.0, type: 'data-flow' },
  { from: 'ffn-shared', to: 'ffn-combine', weight: 0.5, type: 'data-flow' },
  { from: 'ffn-combine', to: 'norm-post-ffn', weight: 1.0, type: 'data-flow' },
  { from: 'ffn-norm-type', to: 'ffn-gate', weight: 0.9, type: 'control-flow' },
  { from: 'ffn-load-balance', to: 'ffn-gate', weight: 0.3, type: 'gradient' },
];
