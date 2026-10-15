import { GraphNode, GraphEdge } from './types';

export const builderNodes: GraphNode[] = [
  { id: 'builder-response-gen', label: 'Response Generator', category: 'builder', section: 'builder-pattern', weight: 0.1, confidence: 0.9, source: 'observed', description: 'Main autoregressive generation after reasoning phase completes', connections: ['builder-format', 'builder-sampling'], metadata: { mode: 'autoregressive', maxTokens: 8192 } },
  { id: 'builder-format', label: 'Output Formatter', category: 'builder', section: 'builder-pattern', weight: 0.02, confidence: 0.85, source: 'inferred', description: 'Structures output with markdown, code blocks, lists as appropriate', connections: ['builder-response-gen'], metadata: { formats: ['markdown', 'code', 'structured', 'plain'] } },
  { id: 'builder-sampling', label: 'Sampling Strategy', category: 'builder', section: 'builder-pattern', weight: 0.01, confidence: 0.82, source: 'inferred', description: 'Temperature, top-p, top-k configuration for generation', connections: ['builder-response-gen'], metadata: { defaultTemp: 0.6, topP: 0.95, topK: 20 } },
  { id: 'builder-tool-call', label: 'Tool Call Formatter', category: 'builder', section: 'builder-pattern', weight: 0.03, confidence: 0.88, source: 'observed', description: 'Formats function calls in structured JSON format for tool use', connections: ['tool-exec', 'builder-response-gen'], metadata: { format: 'json', schema: 'openai-compatible' } },
  { id: 'builder-multi-turn', label: 'Multi-Turn Context Builder', category: 'builder', section: 'builder-pattern', weight: 0.04, confidence: 0.85, source: 'inferred', description: 'Manages conversation history, system prompts, and role formatting', connections: ['ctx-conversation', 'builder-response-gen'], metadata: { roles: ['system', 'user', 'assistant'], history: 'sliding-window' } },
  { id: 'builder-code-exec', label: 'Code Execution Sandbox', category: 'builder', section: 'builder-pattern', weight: 0.02, confidence: 0.7, source: 'gap-filled', description: 'Qwen3 likely supports code execution feedback loop. Gap-filled: assuming sandboxed Python execution with result injection back into context.', connections: ['builder-response-gen', 'ctx-code-result'], metadata: { sandbox: 'python', feedback: true } },
  { id: 'builder-structured', label: 'Structured Output (JSON mode)', category: 'builder', section: 'builder-pattern', weight: 0.02, confidence: 0.8, source: 'inferred', description: 'Constrained generation for guaranteed JSON/schema output', connections: ['builder-response-gen'], metadata: { mode: 'constrained', grammar: 'json-schema' } },
  { id: 'builder-streaming', label: 'Streaming Token Emission', category: 'builder', section: 'builder-pattern', weight: 0.005, confidence: 0.92, source: 'observed', description: 'Token-by-token streaming with SSE protocol', connections: ['builder-response-gen'], metadata: { protocol: 'SSE', chunkSize: 1 } },
];

export const builderEdges: GraphEdge[] = [
  { from: 'builder-response-gen', to: 'builder-format', weight: 0.9, type: 'control-flow' },
  { from: 'builder-response-gen', to: 'builder-sampling', weight: 0.8, type: 'control-flow' },
  { from: 'builder-response-gen', to: 'builder-tool-call', weight: 0.7, type: 'control-flow' },
  { from: 'builder-response-gen', to: 'builder-streaming', weight: 0.95, type: 'data-flow' },
  { from: 'builder-tool-call', to: 'tool-exec', weight: 0.9, type: 'data-flow' },
  { from: 'builder-multi-turn', to: 'builder-response-gen', weight: 0.8, type: 'data-flow' },
  { from: 'builder-structured', to: 'builder-response-gen', weight: 0.6, type: 'control-flow' },
];
