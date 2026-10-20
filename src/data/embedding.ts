import { GraphNode, GraphEdge } from './types';

export const embeddingNodes: GraphNode[] = [
  { id: 'emb-input', label: 'Token Embedding', category: 'embedding', section: 'input-processing', weight: 0.08, confidence: 0.9, source: 'observed', description: 'Embedding matrix [151936, 2560] for MoE-235B or [151936, 4096] for dense 32B', connections: ['emb-pos', 'attn-q'], metadata: { dims: 2560, vocabSize: 151936 } },
  { id: 'emb-pos', label: 'RoPE Positional Encoding', category: 'positional', section: 'input-processing', weight: 0.015, confidence: 0.95, source: 'observed', description: 'Rotary Position Embedding with theta=1000000, base frequency scaling', connections: ['attn-q', 'attn-k'], metadata: { theta: 1000000, scaling: 'yarn', maxPos: 131072 } },
  { id: 'emb-scaling', label: 'YaRN Scaling Factor', category: 'positional', section: 'input-processing', weight: 0.005, confidence: 0.85, source: 'inferred', description: 'Yet-another-RoPE-Extension for 128K+ context length support', connections: ['emb-pos', 'ctx-window'], metadata: { factor: 4.0, originalContext: 32768 } },
  { id: 'emb-output-unembed', label: 'Output Unembedding (tied)', category: 'embedding', section: 'output-generation', weight: 0.08, confidence: 0.92, source: 'observed', description: 'Weight-tied output projection sharing embedding matrix', connections: ['lm-head'], metadata: { tiedWeights: true } },
];

export const embeddingEdges: GraphEdge[] = [
  { from: 'emb-input', to: 'emb-pos', weight: 1.0, type: 'data-flow' },
  { from: 'emb-pos', to: 'attn-q', weight: 0.95, type: 'data-flow' },
  { from: 'emb-pos', to: 'attn-k', weight: 0.95, type: 'data-flow' },
  { from: 'emb-input', to: 'emb-output-unembed', weight: 0.8, type: 'gradient' },
  { from: 'emb-scaling', to: 'emb-pos', weight: 0.9, type: 'control-flow' },
];
