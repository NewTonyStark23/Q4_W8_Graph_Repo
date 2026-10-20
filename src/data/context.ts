import { GraphNode, GraphEdge } from './types';

export const contextNodes: GraphNode[] = [
  { id: 'ctx-system', label: 'System Prompt Handler', category: 'context', section: 'context-window', weight: 0.02, confidence: 0.92, source: 'observed', description: 'Processes system instructions with chat template formatting', connections: ['ctx-conversation'], metadata: { template: 'chatml-variant', maxLen: 32768 } },
  { id: 'ctx-conversation', label: 'Conversation History Manager', category: 'context', section: 'context-window', weight: 0.03, confidence: 0.88, source: 'observed', description: 'Manages multi-turn dialogue with role-based formatting', connections: ['ctx-window'], metadata: { roles: ['system', 'user', 'assistant'], format: 'chatml' } },
  { id: 'ctx-window', label: '128K Context Window', category: 'context', section: 'context-window', weight: 0.04, confidence: 0.9, source: 'observed', description: 'Extended context window supporting up to 128K tokens via YaRN', connections: ['ctx-compress'], metadata: { maxTokens: 131072, baseContext: 32768 } },
  { id: 'ctx-compress', label: 'Context Compression (Soft Prompt)', category: 'context', section: 'context-window', weight: 0.02, confidence: 0.65, source: 'gap-filled', description: 'Gap-filled: Qwen3 likely uses some form of context compression for very long contexts. Assuming learned soft-prompt summarization of older turns.', connections: ['ctx-window'], metadata: { method: 'soft-prompt', compressionRatio: 4 } },
  { id: 'ctx-code-result', label: 'Code Execution Result Injector', category: 'context', section: 'context-window', weight: 0.01, confidence: 0.7, source: 'gap-filled', description: 'Gap-filled: Injects code execution results back into context as tool messages.', connections: ['ctx-conversation'], metadata: { role: 'tool', format: 'observation' } },
  { id: 'ctx-rag', label: 'RAG Context Integration', category: 'context', section: 'context-window', weight: 0.015, confidence: 0.75, source: 'inferred', description: 'Handles retrieved document context injection', connections: ['ctx-window'], metadata: { maxDocs: 10, chunkSize: 512 } },
];

export const contextEdges: GraphEdge[] = [
  { from: 'ctx-system', to: 'ctx-conversation', weight: 1.0, type: 'data-flow' },
  { from: 'ctx-conversation', to: 'ctx-window', weight: 1.0, type: 'data-flow' },
  { from: 'ctx-window', to: 'ctx-compress', weight: 0.6, type: 'control-flow' },
  { from: 'ctx-code-result', to: 'ctx-conversation', weight: 0.8, type: 'data-flow' },
  { from: 'ctx-rag', to: 'ctx-window', weight: 0.7, type: 'data-flow' },
];
