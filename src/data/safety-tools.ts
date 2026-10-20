import { GraphNode, GraphEdge } from './types';

export const safetyNodes: GraphNode[] = [
  { id: 'safety-guardrails', label: 'Safety Guardrails', category: 'safety', section: 'safety-layer', weight: 0.02, confidence: 0.85, source: 'observed', description: 'Multi-layer safety filtering on input and output', connections: ['safety-content-filter', 'safety-jailbreak'], metadata: { layers: ['input', 'reasoning', 'output'] } },
  { id: 'safety-content-filter', label: 'Content Classifier', category: 'safety', section: 'safety-layer', weight: 0.01, confidence: 0.8, source: 'inferred', description: 'Binary/multi-class content safety classifier', connections: ['safety-guardrails'], metadata: { categories: ['harmful', 'illegal', 'nsfw', 'bias'] } },
  { id: 'safety-jailbreak', label: 'Jailbreak Detection', category: 'safety', section: 'safety-layer', weight: 0.01, confidence: 0.75, source: 'inferred', description: 'Detects and refuses adversarial prompt attacks', connections: ['safety-guardrails'], metadata: { methods: ['pattern-match', 'classifier', 'reasoning-check'] } },
  { id: 'safety-refusal', label: 'Refusal Pattern', category: 'safety', section: 'safety-layer', weight: 0.005, confidence: 0.88, source: 'observed', description: 'Standardized refusal responses with explanation', connections: ['builder-response-gen'], metadata: { format: 'polite-refusal-with-explanation' } },
  { id: 'safety-thinking-override', label: 'Thinking Mode Safety', category: 'safety', section: 'safety-layer', weight: 0.008, confidence: 0.7, source: 'gap-filled', description: 'Gap-filled: Safety checks likely also apply within the thinking phase. Assuming reasoning traces are also filtered for harmful content before emission.', connections: ['reasoning-chain-gen', 'safety-guardrails'], metadata: { appliesTo: 'thinking+output', filterThinking: true } },
];

export const safetyEdges: GraphEdge[] = [
  { from: 'safety-guardrails', to: 'safety-content-filter', weight: 0.9, type: 'control-flow' },
  { from: 'safety-guardrails', to: 'safety-jailbreak', weight: 0.85, type: 'control-flow' },
  { from: 'safety-content-filter', to: 'safety-refusal', weight: 0.8, type: 'control-flow' },
  { from: 'safety-jailbreak', to: 'safety-refusal', weight: 0.7, type: 'control-flow' },
  { from: 'safety-thinking-override', to: 'reasoning-chain-gen', weight: 0.6, type: 'control-flow' },
];

export const toolUseNodes: GraphNode[] = [
  { id: 'tool-exec', label: 'Tool Execution Engine', category: 'tool-use', section: 'tool-integration', weight: 0.03, confidence: 0.88, source: 'observed', description: 'Executes function calls and returns results to model', connections: ['tool-detection', 'tool-format'], metadata: { execution: 'sandboxed', timeout: 30000 } },
  { id: 'tool-detection', label: 'Tool Call Detection', category: 'tool-use', section: 'tool-integration', weight: 0.02, confidence: 0.9, source: 'observed', description: 'Identifies when model output is a tool call vs normal text', connections: ['builder-tool-call'], metadata: { trigger: 'function_call_format', detection: 'pattern+semantic' } },
  { id: 'tool-format', label: 'Function Schema Parser', category: 'tool-use', section: 'tool-integration', weight: 0.01, confidence: 0.85, source: 'observed', description: 'Parses and validates function definitions from system prompt', connections: ['tool-detection'], metadata: { schema: 'openai-compatible', validation: true } },
  { id: 'tool-multi-step', label: 'Multi-Step Tool Chaining', category: 'tool-use', section: 'tool-integration', weight: 0.02, confidence: 0.78, source: 'inferred', description: 'Sequential tool calls with intermediate reasoning', connections: ['tool-exec', 'reasoning-chain-gen'], metadata: { maxSteps: 10, chaining: true } },
  { id: 'tool-mcp', label: 'MCP Protocol Support', category: 'tool-use', section: 'tool-integration', weight: 0.01, confidence: 0.72, source: 'gap-filled', description: 'Gap-filled: Qwen3 likely supports Model Context Protocol for standardized tool integration. Assuming OpenAI-compatible function calling as baseline.', connections: ['tool-format'], metadata: { protocol: 'function-calling', mcp: 'likely-supported' } },
  { id: 'tool-web-search', label: 'Web Search Integration', category: 'tool-use', section: 'tool-integration', weight: 0.015, confidence: 0.75, source: 'inferred', description: 'Built-in web search tool for real-time information', connections: ['tool-exec'], metadata: { integration: 'built-in', fallback: 'api' } },
];

export const toolUseEdges: GraphEdge[] = [
  { from: 'tool-detection', to: 'tool-exec', weight: 1.0, type: 'control-flow' },
  { from: 'tool-format', to: 'tool-detection', weight: 0.9, type: 'data-flow' },
  { from: 'tool-exec', to: 'tool-multi-step', weight: 0.7, type: 'data-flow' },
  { from: 'tool-multi-step', to: 'reasoning-chain-gen', weight: 0.6, type: 'data-flow' },
  { from: 'tool-mcp', to: 'tool-format', weight: 0.5, type: 'control-flow' },
  { from: 'tool-web-search', to: 'tool-exec', weight: 0.8, type: 'data-flow' },
];
