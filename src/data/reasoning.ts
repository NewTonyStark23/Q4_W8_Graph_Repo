import { GraphNode, GraphEdge } from './types';

export const reasoningNodes: GraphNode[] = [
  { id: 'reasoning-mode-switch', label: 'Think/NoThink Mode Router', category: 'reasoning', section: 'reasoning-chain', weight: 0.02, confidence: 0.95, source: 'observed', description: 'Routes between extended thinking (budget-controlled) and direct response', connections: ['reasoning-budget', 'reasoning-chain-gen'], metadata: { modes: ['think', 'nothink', 'auto'] } },
  { id: 'reasoning-budget', label: 'Thinking Budget Controller', category: 'reasoning', section: 'reasoning-chain', weight: 0.01, confidence: 0.85, source: 'inferred', description: 'Dynamic budget allocation for reasoning depth based on task complexity', connections: ['reasoning-chain-gen', 'reasoning-stop'], metadata: { maxTokens: 38000, adaptive: true } },
  { id: 'reasoning-chain-gen', label: 'Chain-of-Thought Generator', category: 'reasoning', section: 'reasoning-chain', weight: 0.15, confidence: 0.8, source: 'inferred', description: 'Generates step-by-step reasoning within  tags', connections: ['reasoning-self-refine', 'reasoning-stop'], metadata: { format: '<think>...</think>', streaming: true } },
  { id: 'reasoning-self-refine', label: 'Self-Refinement Loop', category: 'reasoning', section: 'reasoning-chain', weight: 0.05, confidence: 0.75, source: 'inferred', description: 'Iterative self-correction during reasoning, backtracking on errors', connections: ['reasoning-chain-gen', 'reasoning-stop'], metadata: { maxIterations: 5, backtracking: true } },
  { id: 'reasoning-stop', label: 'Thinking Termination Signal', category: 'reasoning', section: 'reasoning-chain', weight: 0.01, confidence: 0.88, source: 'observed', description: 'Determines when reasoning is sufficient, emits  tag', connections: ['builder-response-gen'], metadata: { trigger: '</think>', conditions: ['confidence', 'budget-exhausted'] } },
  { id: 'reasoning-math-spec', label: 'Math/Code Specialization', category: 'reasoning', section: 'reasoning-chain', weight: 0.03, confidence: 0.82, source: 'inferred', description: 'Enhanced reasoning for mathematical proofs and code generation', connections: ['reasoning-chain-gen'], metadata: { domains: ['math', 'code', 'logic', 'science'] } },
  { id: 'reasoning-multi-lang', label: 'Multilingual Reasoning', category: 'reasoning', section: 'reasoning-chain', weight: 0.02, confidence: 0.7, source: 'gap-filled', description: 'Qwen3 likely reasons in English internally even for non-English queries, then translates output. Gap-filled: assuming CoT primacy in English with cross-lingual transfer.', connections: ['reasoning-chain-gen', 'tok-multilingual'], metadata: { internalLang: 'english', outputLang: 'user-preference' } },
  { id: 'reasoning-hybrid', label: 'Hybrid Thinking Mode', category: 'reasoning', section: 'reasoning-chain', weight: 0.02, confidence: 0.88, source: 'observed', description: 'Can switch between thinking and non-thinking mid-conversation', connections: ['reasoning-mode-switch', 'builder-response-gen'], metadata: { switchable: true, perTurn: true } },
];

export const reasoningEdges: GraphEdge[] = [
  { from: 'reasoning-mode-switch', to: 'reasoning-budget', weight: 0.9, type: 'control-flow' },
  { from: 'reasoning-mode-switch', to: 'reasoning-chain-gen', weight: 1.0, type: 'control-flow' },
  { from: 'reasoning-budget', to: 'reasoning-chain-gen', weight: 0.8, type: 'control-flow' },
  { from: 'reasoning-chain-gen', to: 'reasoning-self-refine', weight: 0.7, type: 'data-flow' },
  { from: 'reasoning-self-refine', to: 'reasoning-chain-gen', weight: 0.6, type: 'data-flow' },
  { from: 'reasoning-chain-gen', to: 'reasoning-stop', weight: 0.9, type: 'control-flow' },
  { from: 'reasoning-stop', to: 'builder-response-gen', weight: 1.0, type: 'control-flow' },
  { from: 'reasoning-hybrid', to: 'reasoning-mode-switch', weight: 0.95, type: 'control-flow' },
];
