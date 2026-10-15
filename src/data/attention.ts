import { GraphNode, GraphEdge } from './types';

export const attentionNodes: GraphNode[] = [
  { id: 'attn-q', label: 'Query Projection (Wq)', category: 'attention', section: 'attention-head', weight: 0.06, confidence: 0.93, source: 'observed', description: 'Linear projection for queries, GQA with 32 KV heads / 64 Q heads', connections: ['attn-k', 'attn-v', 'attn-score'], metadata: { heads: 64, kvHeads: 8, headDim: 128 } },
  { id: 'attn-k', label: 'Key Projection (Wk)', category: 'attention', section: 'attention-head', weight: 0.06, confidence: 0.93, source: 'observed', description: 'Linear projection for keys, grouped-query attention', connections: ['attn-score'], metadata: { heads: 8, kvHeads: 8, headDim: 128 } },
  { id: 'attn-v', label: 'Value Projection (Wv)', category: 'attention', section: 'attention-head', weight: 0.06, confidence: 0.93, source: 'observed', description: 'Linear projection for values', connections: ['attn-output'], metadata: { heads: 8, kvHeads: 8, headDim: 128 } },
  { id: 'attn-score', label: 'Scaled Dot-Product Attention', category: 'attention', section: 'attention-head', weight: 0.03, confidence: 0.97, source: 'observed', description: 'QK^T / sqrt(d) with causal mask, softmax normalization', connections: ['attn-output'], metadata: { scale: '1/sqrt(128)', mask: 'causal' } },
  { id: 'attn-output', label: 'Output Projection (Wo)', category: 'attention', section: 'attention-head', weight: 0.06, confidence: 0.93, source: 'observed', description: 'Projects concatenated attention output back to model dim', connections: ['norm-post-attn'], metadata: { outDim: 2560 } },
  { id: 'attn-kv-cache', label: 'KV Cache (PagedAttention)', category: 'attention', section: 'attention-head', weight: 0.02, confidence: 0.88, source: 'inferred', description: 'Dynamic KV cache with paged attention for efficient inference', connections: ['attn-k', 'attn-v'], metadata: { blockSize: 16, dtype: 'fp16' } },
  { id: 'attn-sliding', label: 'Sliding Window Attention', category: 'attention', section: 'attention-head', weight: 0.01, confidence: 0.75, source: 'inferred', description: 'Local attention window for every other layer, global for remaining', connections: ['attn-score'], metadata: { windowSize: 4096, pattern: 'alternate' } },
  { id: 'attn-flash', label: 'Flash Attention v2', category: 'attention', section: 'attention-head', weight: 0.005, confidence: 0.9, source: 'observed', description: 'Memory-efficient exact attention implementation', connections: ['attn-score'], metadata: { version: 2, ioAware: true } },
];

export const attentionEdges: GraphEdge[] = [
  { from: 'attn-q', to: 'attn-score', weight: 1.0, type: 'data-flow' },
  { from: 'attn-k', to: 'attn-score', weight: 1.0, type: 'data-flow' },
  { from: 'attn-v', to: 'attn-output', weight: 1.0, type: 'data-flow' },
  { from: 'attn-score', to: 'attn-output', weight: 1.0, type: 'data-flow' },
  { from: 'attn-kv-cache', to: 'attn-k', weight: 0.8, type: 'data-flow' },
  { from: 'attn-kv-cache', to: 'attn-v', weight: 0.8, type: 'data-flow' },
  { from: 'attn-sliding', to: 'attn-score', weight: 0.6, type: 'control-flow' },
  { from: 'attn-flash', to: 'attn-score', weight: 0.9, type: 'control-flow' },
];
