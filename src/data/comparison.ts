import { ComparisonRating } from './types';

export const comparisonRatings: ComparisonRating[] = [
  {
    category: 'tokenizer',
    graphifyScore: 92,
    missingItems: ['Exact merge rules', 'Unicode normalization specifics', 'Byte fallback table'],
    resolvedItems: ['Vocab size (151936)', 'Special tokens', 'Think/NoThink tags', 'Multilingual coverage'],
    notes: 'Tokenizer is well-documented in config.json. Main gaps are internal BPE merge specifics.'
  },
  {
    category: 'embedding',
    graphifyScore: 88,
    missingItems: ['Exact initialization scheme', 'Gradient accumulation specifics'],
    resolvedItems: ['RoPE configuration', 'YaRN scaling', 'Weight tying', 'Dimension sizes'],
    notes: 'Positional encoding is well-understood. Embedding init scheme inferred from Qwen2.5 patterns.'
  },
  {
    category: 'attention',
    graphifyScore: 90,
    missingItems: ['Exact attention bias terms', 'Head-specific learned biases'],
    resolvedItems: ['GQA configuration (64Q/8KV)', 'Flash Attention v2', 'Sliding window pattern', 'KV cache structure'],
    notes: 'Attention architecture is clearly specified in model config. Sliding window pattern inferred from similar models.'
  },
  {
    category: 'feedforward',
    graphifyScore: 85,
    missingItems: ['Expert initialization strategy', 'Exact routing temperature', 'Expert dropout rates'],
    resolvedItems: ['MoE structure (128 experts, top-8)', 'SwiGLU activation', 'Shared expert', 'Load balancing'],
    notes: 'MoE architecture confirmed from technical report. Some routing specifics are inferred.'
  },
  {
    category: 'reasoning',
    graphifyScore: 72,
    missingItems: ['Exact thinking budget algorithm', 'Self-refinement trigger conditions', 'Internal reasoning language switching', 'Confidence threshold for stopping'],
    resolvedItems: ['Think/NoThink mode', 'Hybrid switching', 'Budget control concept', 'Chain-of-thought format'],
    notes: 'Reasoning is the most opaque section. We know the interface (tags, modes) but internal mechanisms are largely inferred from behavior observation.'
  },
  {
    category: 'builder',
    graphifyScore: 78,
    missingItems: ['Exact sampling defaults per task type', 'Format selection heuristics', 'Streaming chunk optimization'],
    resolvedItems: ['Autoregressive generation', 'Tool call formatting', 'Multi-turn management', 'Streaming support'],
    notes: 'Builder patterns are observable from output behavior. Some internal heuristics for format selection are gap-filled.'
  },
  {
    category: 'context',
    graphifyScore: 80,
    missingItems: ['Exact compression algorithm', 'RAG chunking strategy', 'Context eviction policy'],
    resolvedItems: ['128K window via YaRN', 'ChatML template', 'Conversation management', 'System prompt handling'],
    notes: 'Context window is well-documented. Compression and eviction strategies are gap-filled based on industry patterns.'
  },
  {
    category: 'training',
    graphifyScore: 75,
    missingItems: ['Exact data mix ratios', 'Learning rate schedules per phase', 'Gradient clipping values', 'Checkpoint strategy'],
    resolvedItems: ['4-phase training', 'GRPO algorithm', '15T+ tokens', 'Synthetic data pipeline'],
    notes: 'Training pipeline is partially documented in technical report. Specific hyperparameters are inferred.'
  },
  {
    category: 'inference',
    graphifyScore: 88,
    missingItems: ['Exact batch size limits per model size', 'Memory optimization specifics'],
    resolvedItems: ['vLLM support', 'Quantization formats', 'Tensor parallelism', 'Continuous batching'],
    notes: 'Inference is well-understood as it uses standard tooling. Model-specific optimizations are inferred.'
  },
  {
    category: 'safety',
    graphifyScore: 65,
    missingItems: ['Exact classifier architecture', 'Training data for safety models', 'Refusal trigger thresholds', 'Thinking-phase safety specifics'],
    resolvedItems: ['Multi-layer safety', 'Content filtering', 'Jailbreak detection', 'Refusal patterns'],
    notes: 'Safety is intentionally opaque. Most details are gap-filled based on observable refusal patterns and industry standards.'
  },
  {
    category: 'tool-use',
    graphifyScore: 82,
    missingItems: ['Exact tool schema validation', 'Error handling strategies', 'MCP protocol specifics'],
    resolvedItems: ['Function calling format', 'Tool detection', 'Multi-step chaining', 'Web search integration'],
    notes: 'Tool use is observable from API behavior. Internal validation and error handling are gap-filled.'
  }
];

export const overallScore = {
  graphifyScore: 81.4,
  totalNodes: 0, // will be calculated
  totalEdges: 0, // will be calculated
  observedCount: 0,
  inferredCount: 0,
  gapFilledCount: 0,
  summary: 'The graphified model captures approximately 81% of Qwen3 architecture with high confidence. Strongest areas: attention (90%), tokenizer (92%), inference (88%). Weakest: safety (65%), reasoning internals (72%). Key gaps: exact training hyperparameters, safety classifier details, and reasoning budget algorithm.'
};
