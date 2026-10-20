import { GraphNode, GraphEdge } from './types';

export const tokenizerNodes: GraphNode[] = [
  { id: 'tok-bpe-base', label: 'BPE Tokenizer Base', category: 'tokenizer', section: 'input-processing', weight: 0.02, confidence: 0.85, source: 'observed', description: 'Byte-pair encoding vocabulary ~151936 tokens matching Qwen2.5 base', connections: ['tok-special', 'emb-input'], metadata: { vocabSize: 151936, merges: 32000 } },
  { id: 'tok-special', label: 'Special Tokens', category: 'tokenizer', section: 'input-processing', weight: 0.005, confidence: 0.95, source: 'observed', description: 'BOS, EOS, PAD, UNK, IM_START, IM_END, THINK tags', connections: ['tok-bpe-base', 'ctx-system'], metadata: { tokens: ['<|im_start|>', '<|im_end|>', '<|thought|>', '<|/thought|>'] } },
  { id: 'tok-think-tags', label: 'Think/NoThink Tags', category: 'tokenizer', section: 'input-processing', weight: 0.003, confidence: 0.98, source: 'observed', description: '/think and /nothink control tokens for reasoning mode toggle', connections: ['reasoning-mode-switch'], metadata: { tokens: ['/think', '/nothink'] } },
  { id: 'tok-multilingual', label: 'Multilingual Subword', category: 'tokenizer', section: 'input-processing', weight: 0.01, confidence: 0.8, source: 'inferred', description: 'Coverage for 29+ languages with shared subword units', connections: ['tok-bpe-base'], metadata: { languages: 29 } },
];

export const tokenizerEdges: GraphEdge[] = [
  { from: 'tok-bpe-base', to: 'tok-special', weight: 0.9, type: 'data-flow' },
  { from: 'tok-bpe-base', to: 'emb-input', weight: 1.0, type: 'data-flow' },
  { from: 'tok-special', to: 'ctx-system', weight: 0.7, type: 'control-flow' },
  { from: 'tok-think-tags', to: 'reasoning-mode-switch', weight: 0.95, type: 'control-flow' },
];
