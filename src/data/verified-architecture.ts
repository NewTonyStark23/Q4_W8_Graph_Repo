/**
 * QWEN3 VERIFIED ARCHITECTURE
 * 
 * Source: Official Qwen3 Technical Report (arXiv:2505.09388, May 2025)
 * 
 * This file contains VERIFIED architectural details from the official paper.
 * All previous inferences have been corrected to match the real specifications.
 */

export interface VerifiedSpec {
  model: string;
  layers: number;
  qHeads: number;
  kvHeads: number;
  totalParams: string;
  activatedParams?: string;
  totalExperts?: number;
  activatedExperts?: number;
  contextLength: string;
  tieEmbedding: boolean;
  vocabularySize: number;
}

export const verifiedDenseModels: VerifiedSpec[] = [
  { model: 'Qwen3-0.6B', layers: 28, qHeads: 16, kvHeads: 8, totalParams: '0.6B', contextLength: '32K', tieEmbedding: true, vocabularySize: 151669 },
  { model: 'Qwen3-1.7B', layers: 28, qHeads: 16, kvHeads: 8, totalParams: '1.7B', contextLength: '32K', tieEmbedding: true, vocabularySize: 151669 },
  { model: 'Qwen3-4B', layers: 36, qHeads: 32, kvHeads: 8, totalParams: '4B', contextLength: '128K', tieEmbedding: true, vocabularySize: 151669 },
  { model: 'Qwen3-8B', layers: 36, qHeads: 32, kvHeads: 8, totalParams: '8B', contextLength: '128K', tieEmbedding: false, vocabularySize: 151669 },
  { model: 'Qwen3-14B', layers: 40, qHeads: 40, kvHeads: 8, totalParams: '14B', contextLength: '128K', tieEmbedding: false, vocabularySize: 151669 },
  { model: 'Qwen3-32B', layers: 64, qHeads: 64, kvHeads: 8, totalParams: '32B', contextLength: '128K', tieEmbedding: false, vocabularySize: 151669 },
];

export const verifiedMoEModels: VerifiedSpec[] = [
  { model: 'Qwen3-30B-A3B', layers: 48, qHeads: 32, kvHeads: 4, totalParams: '30B', activatedParams: '3B', totalExperts: 128, activatedExperts: 8, contextLength: '128K', tieEmbedding: false, vocabularySize: 151669 },
  { model: 'Qwen3-235B-A22B', layers: 94, qHeads: 64, kvHeads: 4, totalParams: '235B', activatedParams: '22B', totalExperts: 128, activatedExperts: 8, contextLength: '128K', tieEmbedding: false, vocabularySize: 151669 },
];

/**
 * CRITICAL CORRECTIONS from official report:
 * 
 * 1. KV heads for MoE-235B = 4 (NOT 8 as previously inferred)
 * 2. Vocabulary size = 151,669 (NOT 151,936)
 * 3. NO shared experts in Qwen3 MoE (unlike Qwen2.5-MoE)
 * 4. QK-Norm is used (new in Qwen3)
 * 5. NO QKV bias (removed from Qwen2)
 * 6. 94 layers for flagship (not ~80)
 * 7. 36T tokens pre-training (not 15T)
 * 8. Fine-grained expert segmentation (DeepSeekMoE style)
 * 9. Global-batch load balancing loss
 */

export const verifiedTrainingDetails = {
  preTraining: {
    totalTokens: '36 trillion',
    languages: 119,
    stages: [
      { name: 'General Stage (S1)', tokens: '30T+', seqLength: 4096, description: 'Language proficiency and general world knowledge' },
      { name: 'Reasoning Stage (S2)', tokens: '5T', seqLength: 4096, description: 'STEM, coding, reasoning, synthetic data. Accelerated LR decay.' },
      { name: 'Long Context Stage', tokens: 'hundreds of billions', seqLength: 32768, description: '75% text 16K-32K, 25% text 4K-16K. RoPE base 10K→1M via ABF. YARN + DCA for 4x inference length.' },
    ],
    dataSources: [
      'Qwen2.5-VL for PDF text extraction',
      'Qwen2.5-Math for mathematical content',
      'Qwen2.5-Coder for code data',
      'Multilingual data (119 languages)',
      'Synthetic data (textbooks, QA, instructions, code)'
    ],
    dataAnnotation: {
      totalAnnotated: '30T+ tokens',
      dimensions: ['educational value', 'fields', 'domains', 'safety'],
      optimizationLevel: 'instance-level (not source/domain level)'
    }
  },
  postTraining: {
    stages: [
      {
        name: 'Stage 1: Long-CoT Cold Start',
        description: 'Foundation reasoning patterns via curated dataset',
        dataSources: ['math', 'code', 'logical reasoning', 'STEM'],
        process: 'Generate N candidates via QwQ-32B, filter by correctness, remove repetitions/guessing',
        goal: 'Instill foundational reasoning without overfitting'
      },
      {
        name: 'Stage 2: Reasoning RL',
        algorithm: 'GRPO',
        queryPairs: 3995,
        criteria: ['not used in cold-start', 'learnable for model', 'maximally challenging', 'broad sub-domain coverage'],
        technique: 'Large batch size, high rollouts per query, off-policy training',
        entropyControl: 'Steady increase or stable entropy for exploration/exploitation balance',
        example: 'AIME\'24 score: 70.1 → 85.1 over 170 RL steps'
      },
      {
        name: 'Stage 3: Thinking Mode Fusion',
        description: 'Integrate non-thinking capabilities into thinking model',
        method: 'Continual SFT with combined thinking + non-thinking data',
        chatTemplate: {
          thinkingMode: '/think flag in user query (default)',
          nonThinkingMode: '/no_think flag, empty think block in response',
          stopInstruction: 'Considering the limited time by the user, I have to give the solution based on the thinking directly now.\n</think>.\n\n'
        },
        thinkingBudget: 'Emergent ability - model naturally handles intermediate cases when trained on both modes'
      },
      {
        name: 'Stage 4: General RL',
        description: 'Broadly enhance capabilities across 20+ tasks',
        capabilities: [
          'Instruction Following',
          'Format Following',
          'Preference Alignment',
          'Agent Ability',
          'Specialized Scenarios (RAG)'
        ],
        rewardTypes: [
          'Rule-based reward (high precision, prevents reward hacking)',
          'Model-based with reference (Qwen2.5-72B-Instruct as judge)',
          'Model-based without reference (trained reward model on human preferences)'
        ]
      }
    ],
    distillation: {
      name: 'Strong-to-Weak Distillation',
      targetModels: ['Qwen3-0.6B', 'Qwen3-1.7B', 'Qwen3-4B', 'Qwen3-8B', 'Qwen3-14B', 'Qwen3-30B-A3B'],
      phases: [
        { name: 'Off-policy Distillation', description: 'Combine /think and /no_think outputs from teacher' },
        { name: 'On-policy Distillation', description: 'Student generates sequences, aligns logits with teacher via KL divergence' }
      ],
      efficiency: '1/10 GPU hours vs 4-stage training',
      teachers: ['Qwen3-32B', 'Qwen3-235B-A22B']
    }
  }
};

export const verifiedSamplingParams = {
  thinkingMode: {
    temperature: 0.6,
    topP: 0.95,
    topK: 20,
    presencePenalty: 1.5, // only for Creative Writing v3 and WritingBench
    maxOutputLength: 32768,
    maxOutputLengthAIME: 38912
  },
  nonThinkingMode: {
    temperature: 0.7,
    topP: 0.8,
    topK: 20,
    presencePenalty: 1.5,
    maxOutputLength: 32768,
    maxOutputLengthAIME: 38912
  }
};

export const verifiedArchitectureFeatures = {
  attention: {
    type: 'Grouped Query Attention (GQA)',
    qkNorm: true, // NEW in Qwen3
    qkvBias: false, // REMOVED from Qwen2
    ropeBaseFreq: { original: 10000, extended: 1000000 },
    ropeTechnique: 'ABF (Applied Base Frequency)',
    longContextTechniques: ['YARN', 'Dual Chunk Attention (DCA)'],
    contextScaling: '4x increase via YARN+DCA'
  },
  feedforward: {
    activation: 'SwiGLU',
    moE: {
      totalExperts: 128,
      activatedExperts: 8,
      sharedExperts: 0, // NONE - unlike Qwen2.5-MoE
      expertSegmentation: 'fine-grained (DeepSeekMoE style)',
      loadBalancing: 'global-batch load balancing loss'
    }
  },
  normalization: {
    type: 'RMSNorm',
    position: 'pre-normalization'
  },
  positional: {
    type: 'Rotary Positional Embeddings (RoPE)',
    baseFrequency: 1000000, // increased from 10000
    technique: 'ABF'
  },
  tokenizer: {
    type: 'byte-level byte-pair encoding (BBPE)',
    vocabularySize: 151669,
    source: 'Qwen tokenizer'
  }
};

export const verifiedBenchmarkResults = {
  flagship: {
    model: 'Qwen3-235B-A22B',
    thinking: {
      'AIME\'24': 85.7,
      'AIME\'25': 81.5,
      'MATH-500': 96.4,
      'LiveCodeBench v5': 70.7,
      'CodeForces': 2056,
      'BFCL v3': 70.8,
      'MMLU-Redux': 92.7,
      'GPQA-Diamond': 71.1,
      'Arena-Hard': 95.6
    },
    nonThinking: {
      'AIME\'24': 40.1,
      'AIME\'25': 24.7,
      'MATH-500': 91.2,
      'LiveCodeBench v5': 35.3,
      'CodeForces': 1387,
      'BFCL v3': 68.0,
      'MMLU-Redux': 89.2,
      'GPQA-Diamond': 62.9,
      'Arena-Hard': 96.1
    }
  }
};
