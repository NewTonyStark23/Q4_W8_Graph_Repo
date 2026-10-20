import { GraphNode, GraphEdge } from './types';

export const trainingNodes: GraphNode[] = [
  { id: 'train-pretrain', label: 'Pre-training (15T tokens)', category: 'training', section: 'input-processing', weight: 0.4, confidence: 0.85, source: 'observed', description: 'Massive pre-training on 15T+ tokens across 119 languages', connections: ['train-sft'], metadata: { tokens: '15T+', languages: 119, phases: 4 } },
  { id: 'train-sft', label: 'Supervised Fine-Tuning', category: 'training', section: 'input-processing', weight: 0.15, confidence: 0.8, source: 'inferred', description: 'Instruction tuning with curated QA pairs and reasoning traces', connections: ['train-rl'], metadata: { dataMix: 'synthetic+human', reasoningTraces: true } },
  { id: 'train-rl', label: 'RLHF / GRPO Training', category: 'training', section: 'input-processing', weight: 0.1, confidence: 0.82, source: 'observed', description: 'Group Relative Policy Optimization for reasoning alignment', connections: ['train-reward'], metadata: { algorithm: 'GRPO', rewardModel: 'rule-based+learned' } },
  { id: 'train-reward', label: 'Reward Model Ensemble', category: 'training', section: 'input-processing', weight: 0.03, confidence: 0.7, source: 'inferred', description: 'Multiple reward signals: correctness, helpfulness, safety, format', connections: ['train-rl'], metadata: { signals: ['correctness', 'helpfulness', 'safety', 'format'] } },
  { id: 'train-data-quality', label: 'Synthetic Data Pipeline', category: 'training', section: 'input-processing', weight: 0.05, confidence: 0.78, source: 'inferred', description: 'Large-scale synthetic data generation for reasoning and math', connections: ['train-sft'], metadata: { sources: ['self-play', 'distillation', 'verification'] } },
  { id: 'train-phase-stages', label: '4-Phase Training', category: 'training', section: 'input-processing', weight: 0.02, confidence: 0.88, source: 'observed', description: 'Pre-training -> SFT -> Reasoning RL -> Integration', connections: ['train-pretrain', 'train-sft', 'train-rl'], metadata: { stages: ['pretrain', 'sft', 'reasoning-rl', 'integration'] } },
];

export const trainingEdges: GraphEdge[] = [
  { from: 'train-pretrain', to: 'train-sft', weight: 1.0, type: 'gradient' },
  { from: 'train-sft', to: 'train-rl', weight: 1.0, type: 'gradient' },
  { from: 'train-rl', to: 'train-reward', weight: 0.9, type: 'data-flow' },
  { from: 'train-data-quality', to: 'train-sft', weight: 0.8, type: 'data-flow' },
  { from: 'train-phase-stages', to: 'train-pretrain', weight: 0.9, type: 'control-flow' },
];

export const inferenceNodes: GraphNode[] = [
  { id: 'inf-vllm', label: 'vLLM Inference Engine', category: 'inference', section: 'output-generation', weight: 0.02, confidence: 0.9, source: 'observed', description: 'Primary serving framework with PagedAttention', connections: ['inf-quant', 'inf-speculative'], metadata: { engine: 'vllm', pagedAttention: true } },
  { id: 'inf-quant', label: 'Quantization (GPTQ/AWQ/GGUF)', category: 'inference', section: 'output-generation', weight: 0.01, confidence: 0.88, source: 'observed', description: 'Multiple quantization formats for deployment flexibility', connections: ['inf-vllm'], metadata: { formats: ['GPTQ-Int4', 'AWQ', 'GGUF-Q4', 'FP8'] } },
  { id: 'inf-speculative', label: 'Speculative Decoding', category: 'inference', section: 'output-generation', weight: 0.01, confidence: 0.75, source: 'inferred', description: 'Draft-verify acceleration for faster generation', connections: ['inf-vllm'], metadata: { draftModel: 'smaller-qwen', acceptanceRate: 0.7 } },
  { id: 'inf-tensor-parallel', label: 'Tensor Parallelism', category: 'inference', section: 'output-generation', weight: 0.005, confidence: 0.85, source: 'observed', description: 'Multi-GPU inference with tensor parallel distribution', connections: ['inf-vllm'], metadata: { maxGPUs: 8, strategy: 'tensor-parallel' } },
  { id: 'inf-batching', label: 'Continuous Batching', category: 'inference', section: 'output-generation', weight: 0.005, confidence: 0.9, source: 'observed', description: 'Dynamic request batching for throughput optimization', connections: ['inf-vllm'], metadata: { strategy: 'continuous', maxBatchSize: 256 } },
];

export const inferenceEdges: GraphEdge[] = [
  { from: 'inf-vllm', to: 'inf-quant', weight: 0.8, type: 'control-flow' },
  { from: 'inf-vllm', to: 'inf-speculative', weight: 0.6, type: 'control-flow' },
  { from: 'inf-vllm', to: 'inf-tensor-parallel', weight: 0.9, type: 'control-flow' },
  { from: 'inf-vllm', to: 'inf-batching', weight: 0.95, type: 'control-flow' },
];
