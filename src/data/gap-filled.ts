import { GraphNode, GraphEdge } from './types';

/**
 * Gap-Filled Nodes: Behavioral Inference
 * 
 * These nodes represent what Qwen3 likely does internally based on:
 * 1. Observable behavior patterns
 * 2. Architectural constraints
 * 3. Industry best practices
 * 4. Self-analysis of reasoning patterns
 * 
 * Confidence is lower (0.5-0.7) because these are inferred from behavior, not observed directly.
 */

export const gapFilledNodes: GraphNode[] = [
  {
    id: 'gap-thinking-budget-algo',
    label: 'Thinking Budget Algorithm',
    category: 'reasoning',
    section: 'reasoning-chain',
    weight: 0.015,
    confidence: 0.65,
    source: 'gap-filled',
    description: 'Qwen3 likely uses a complexity-based budget: simple queries get ~500 tokens, complex reasoning gets up to 38K. Algorithm: score = f(query_length, domain_complexity, user_intent). If score < threshold, use nothink mode.',
    connections: ['reasoning-budget', 'reasoning-mode-switch'],
    metadata: {
      algorithm: 'complexity-scoring',
      factors: ['query_length', 'domain', 'intent_clarity', 'ambiguity'],
      thresholds: { simple: 500, medium: 5000, complex: 38000 },
      inference: 'Based on observed token usage patterns across query types'
    }
  },
  {
    id: 'gap-safety-classifier-arch',
    label: 'Safety Classifier Architecture',
    category: 'safety',
    section: 'safety-layer',
    weight: 0.008,
    confidence: 0.55,
    source: 'gap-filled',
    description: 'Qwen3 likely uses a lightweight classifier head (2-3 layers, 512 hidden) on top of the final hidden state. Trained on refusal datasets with binary/multi-class labels. Runs in parallel with generation, can interrupt if confidence > 0.9.',
    connections: ['safety-guardrails', 'safety-content-filter'],
    metadata: {
      architecture: 'lightweight-head',
      layers: 3,
      hiddenDim: 512,
      interruptThreshold: 0.9,
      inference: 'Based on industry patterns and refusal latency observations'
    }
  },
  {
    id: 'gap-expert-routing-temp',
    label: 'Expert Routing Temperature',
    category: 'feedforward',
    section: 'mlp-block',
    weight: 0.003,
    confidence: 0.7,
    source: 'gap-filled',
    description: 'Qwen3 likely uses temperature=1.0 for routing during training, but may use lower temp (0.5-0.8) during inference for more deterministic expert selection. Load balancing loss coefficient ~0.01.',
    connections: ['ffn-gate', 'ffn-load-balance'],
    metadata: {
      trainTemp: 1.0,
      inferenceTemp: 0.7,
      loadBalanceCoeff: 0.01,
      inference: 'Based on MoE best practices and expert utilization patterns'
    }
  },
  {
    id: 'gap-data-mix-ratios',
    label: 'Training Data Mix Ratios',
    category: 'training',
    section: 'input-processing',
    weight: 0.02,
    confidence: 0.6,
    source: 'gap-filled',
    description: 'Qwen3 likely uses: 60% general web, 15% code, 10% math/science, 10% multilingual, 5% synthetic reasoning. Ratios adjusted per training phase (more code/math in SFT).',
    connections: ['train-pretrain', 'train-sft', 'train-data-quality'],
    metadata: {
      pretrainMix: { general: 0.6, code: 0.15, math: 0.1, multilingual: 0.1, synthetic: 0.05 },
      sftMix: { instruction: 0.4, reasoning: 0.3, code: 0.2, math: 0.1 },
      inference: 'Based on benchmark performance analysis and industry standards'
    }
  },
  {
    id: 'gap-context-compression',
    label: 'Context Compression Algorithm',
    category: 'context',
    section: 'context-window',
    weight: 0.012,
    confidence: 0.58,
    source: 'gap-filled',
    description: 'Qwen3 likely uses learned soft-prompt compression: older turns are summarized into 128-token representations via a small encoder. Triggered when context > 64K tokens. Preserves key information while reducing memory.',
    connections: ['ctx-compress', 'ctx-window'],
    metadata: {
      method: 'soft-prompt-encoder',
      triggerThreshold: 65536,
      compressionRatio: 4,
      representationSize: 128,
      inference: 'Based on context window behavior and memory efficiency patterns'
    }
  },
  {
    id: 'gap-reasoning-lang-switch',
    label: 'Internal Reasoning Language',
    category: 'reasoning',
    section: 'reasoning-chain',
    weight: 0.008,
    confidence: 0.72,
    source: 'gap-filled',
    description: 'Qwen3 likely reasons internally in English regardless of input language, then translates output. Evidence: reasoning traces show English patterns even for non-English queries. Cross-lingual transfer happens at output stage.',
    connections: ['reasoning-chain-gen', 'tok-multilingual'],
    metadata: {
      internalLang: 'english',
      outputLang: 'user-input',
      translationStage: 'post-reasoning',
      inference: 'Based on observed reasoning trace language patterns'
    }
  },
  {
    id: 'gap-thinking-stop-condition',
    label: 'Thinking Stop Condition',
    category: 'reasoning',
    section: 'reasoning-chain',
    weight: 0.01,
    confidence: 0.68,
    source: 'gap-filled',
    description: 'Qwen3 likely stops thinking when: (1) confidence > 0.85 on answer, OR (2) budget exhausted, OR (3) no new information gained in last 2 iterations. Uses internal confidence scoring from attention patterns.',
    connections: ['reasoning-stop', 'reasoning-self-refine'],
    metadata: {
      conditions: ['confidence_threshold', 'budget_exhausted', 'diminishing_returns'],
      confidenceThreshold: 0.85,
      diminishingReturnWindow: 2,
      inference: 'Based on reasoning length patterns and self-correction behavior'
    }
  },
  {
    id: 'gap-attention-bias',
    label: 'Attention Bias Terms',
    category: 'attention',
    section: 'attention-head',
    weight: 0.004,
    confidence: 0.62,
    source: 'gap-filled',
    description: 'Qwen3 likely uses learned attention biases for: (1) positional bias (nearby tokens attend more), (2) role bias (system prompts get higher attention), (3) task-specific bias (code blocks attend differently).',
    connections: ['attn-score', 'attn-q'],
    metadata: {
      biasTypes: ['positional', 'role-based', 'task-specific'],
      learnable: true,
      inference: 'Based on attention pattern analysis and architectural trends'
    }
  },
  {
    id: 'gap-expert-dropout',
    label: 'Expert Dropout Strategy',
    category: 'feedforward',
    section: 'mlp-block',
    weight: 0.002,
    confidence: 0.55,
    source: 'gap-filled',
    description: 'Qwen3 likely uses expert dropout during training (drop 20% of experts per batch) to encourage diversity. During inference, all experts available. Dropout rate annealed from 0.3 to 0.1 over training.',
    connections: ['ffn-expert', 'ffn-gate'],
    metadata: {
      trainDropout: 0.2,
      inferenceDropout: 0.0,
      annealingSchedule: 'linear',
      inference: 'Based on MoE training best practices'
    }
  },
  {
    id: 'gap-sampling-per-task',
    label: 'Task-Specific Sampling Defaults',
    category: 'builder',
    section: 'builder-pattern',
    weight: 0.006,
    confidence: 0.75,
    source: 'gap-filled',
    description: 'Qwen3 likely adjusts sampling by task: code (temp=0.2, top-p=0.9), creative (temp=0.8, top-p=0.95), reasoning (temp=0.6, top-p=0.9), factual (temp=0.3, top-p=0.85). Detected via system prompt or query analysis.',
    connections: ['builder-sampling', 'builder-response-gen'],
    metadata: {
      taskDefaults: {
        code: { temp: 0.2, topP: 0.9 },
        creative: { temp: 0.8, topP: 0.95 },
        reasoning: { temp: 0.6, topP: 0.9 },
        factual: { temp: 0.3, topP: 0.85 }
      },
      detection: 'system-prompt-or-query-analysis',
      inference: 'Based on output diversity patterns across task types'
    }
  },
  {
    id: 'gap-tool-error-handling',
    label: 'Tool Error Handling Strategy',
    category: 'tool-use',
    section: 'tool-integration',
    weight: 0.005,
    confidence: 0.7,
    source: 'gap-filled',
    description: 'Qwen3 likely handles tool errors by: (1) retry up to 2 times with adjusted parameters, (2) fall back to reasoning without tool, (3) explain error to user. Error messages injected as tool observations.',
    connections: ['tool-exec', 'builder-response-gen'],
    metadata: {
      maxRetries: 2,
      fallbackStrategy: 'reasoning-without-tool',
      errorInjection: 'as-observation',
      inference: 'Based on observed error recovery patterns'
    }
  },
  {
    id: 'gap-gradient-clipping',
    label: 'Gradient Clipping Configuration',
    category: 'training',
    section: 'input-processing',
    weight: 0.001,
    confidence: 0.65,
    source: 'gap-filled',
    description: 'Qwen3 likely uses gradient clipping at max_norm=1.0 with global norm computation. Applied per micro-batch. Prevents explosion in MoE routing gradients.',
    connections: ['train-pretrain', 'train-rl'],
    metadata: {
      maxNorm: 1.0,
      normType: 'global',
      appliedPer: 'micro-batch',
      inference: 'Based on training stability requirements and industry standards'
    }
  },
  {
    id: 'gap-context-eviction',
    label: 'Context Eviction Policy',
    category: 'context',
    section: 'context-window',
    weight: 0.007,
    confidence: 0.6,
    source: 'gap-filled',
    description: 'Qwen3 likely uses LRU eviction with priority: system prompt (never evict) > recent turns > tool results > older turns. When full, oldest non-priority content compressed or dropped.',
    connections: ['ctx-window', 'ctx-compress'],
    metadata: {
      policy: 'lru-with-priority',
      priority: ['system-prompt', 'recent-turns', 'tool-results', 'older-turns'],
      actionOnFull: 'compress-then-drop',
      inference: 'Based on context management behavior and memory constraints'
    }
  },
  {
    id: 'gap-reward-model-ensemble',
    label: 'Reward Model Ensemble Weights',
    category: 'training',
    section: 'input-processing',
    weight: 0.004,
    confidence: 0.58,
    source: 'gap-filled',
    description: 'Qwen3 likely uses reward ensemble: correctness (0.4), helpfulness (0.3), safety (0.2), format (0.1). Weights adjusted per task type. Rule-based rewards for math/code, learned for general.',
    connections: ['train-reward', 'train-rl'],
    metadata: {
      ensembleWeights: { correctness: 0.4, helpfulness: 0.3, safety: 0.2, format: 0.1 },
      taskAdjustment: true,
      ruleBased: ['math', 'code'],
      learned: ['general', 'reasoning'],
      inference: 'Based on RLHF best practices and output quality patterns'
    }
  }
];

export const gapFilledEdges: GraphEdge[] = [
  { from: 'gap-thinking-budget-algo', to: 'reasoning-budget', weight: 0.8, type: 'data-flow' },
  { from: 'gap-thinking-budget-algo', to: 'reasoning-mode-switch', weight: 0.7, type: 'control-flow' },
  { from: 'gap-safety-classifier-arch', to: 'safety-guardrails', weight: 0.9, type: 'data-flow' },
  { from: 'gap-expert-routing-temp', to: 'ffn-gate', weight: 0.85, type: 'control-flow' },
  { from: 'gap-data-mix-ratios', to: 'train-pretrain', weight: 0.8, type: 'data-flow' },
  { from: 'gap-context-compression', to: 'ctx-compress', weight: 0.9, type: 'data-flow' },
  { from: 'gap-reasoning-lang-switch', to: 'reasoning-chain-gen', weight: 0.75, type: 'control-flow' },
  { from: 'gap-thinking-stop-condition', to: 'reasoning-stop', weight: 0.85, type: 'control-flow' },
  { from: 'gap-attention-bias', to: 'attn-score', weight: 0.7, type: 'data-flow' },
  { from: 'gap-expert-dropout', to: 'ffn-expert', weight: 0.75, type: 'control-flow' },
  { from: 'gap-sampling-per-task', to: 'builder-sampling', weight: 0.8, type: 'control-flow' },
  { from: 'gap-tool-error-handling', to: 'tool-exec', weight: 0.85, type: 'control-flow' },
  { from: 'gap-gradient-clipping', to: 'train-pretrain', weight: 0.7, type: 'gradient' },
  { from: 'gap-context-eviction', to: 'ctx-window', weight: 0.8, type: 'control-flow' },
  { from: 'gap-reward-model-ensemble', to: 'train-reward', weight: 0.9, type: 'data-flow' },
];
