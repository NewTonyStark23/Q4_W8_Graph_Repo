/**
 * QWEN4 REASONING ENGINE - CORE TYPES
 * 
 * This is NOT a model. This is a reasoning OS.
 * A living graph that activates only what's needed.
 * Like a video game engine - renders only what's in view.
 */

// ============================================
// REASONING PATTERN TYPES
// ============================================

export interface ReasoningPattern {
  id: string;
  name: string;
  category: ReasoningCategory;
  algorithm: AlgorithmSpec;
  atomicMemories: string[]; // IDs of atomic memories this pattern uses
  reasoningChain: ReasoningStep[];
  inputs: Port[];
  outputs: Port[];
  resourceRequirements: ResourceSpec;
  composabilityRules: ComposabilityRule[];
  learningHooks: LearningHook[];
  confidence: number; // 0-1
  version: string;
}

export type ReasoningCategory =
  | 'prediction' | 'pattern-recognition' | 'web' | 'code' | 'trading'
  | 'automation' | 'voice' | 'evolution' | 'personalization' | 'ethics'
  | 'interaction' | 'open-systems' | 'generation' | 'notification'
  | 'core' | 'memory' | 'routing' | 'reasoning' | 'multimodal'
  | 'optimization' | 'adaptation' | 'tools' | 'training';

export interface AlgorithmSpec {
  name: string;
  type: 'transformer' | 'statistical' | 'ml' | 'rule-based' | 'hybrid' | 'graph-traversal';
  complexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(n³)';
  parallelizable: boolean;
  gpuAccelerated: boolean;
  description: string;
  parameters: Record<string, any>;
}

export interface ReasoningStep {
  id: string;
  name: string;
  operation: string;
  inputs: string[]; // Port IDs
  outputs: string[]; // Port IDs
  condition?: string; // When to execute this step
  parallel?: string[]; // Steps that can run in parallel
  timeout?: number; // ms
  fallback?: string; // Step ID if this fails
}

export interface Port {
  id: string;
  name: string;
  type: DataType;
  required: boolean;
  description: string;
  defaultValue?: any;
}

export type DataType =
  | 'text' | 'number' | 'boolean' | 'array' | 'object' | 'image' | 'audio'
  | 'video' | 'code' | 'embedding' | 'distribution' | 'graph' | 'atomic-memory'
  | 'context' | 'signal' | 'any';

export interface ResourceSpec {
  ram: { min: number; max: number }; // MB
  cpu: { min: number; max: number }; // % of one core
  gpu: { min: number; max: number }; // % of GPU
  vram: { min: number; max: number }; // MB
  disk: { min: number; max: number }; // MB
  latency: { min: number; max: number }; // ms
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface ComposabilityRule {
  canComposeWith: string[]; // Pattern IDs
  compositionType: 'sequential' | 'parallel' | 'conditional' | 'merge';
  resultPattern?: string; // ID of resulting pattern
  constraints?: string[];
}

export interface LearningHook {
  event: 'success' | 'failure' | 'timeout' | 'user-correction' | 'performance-change';
  action: 'increase-weight' | 'decrease-weight' | 'adjust-parameter' | 'retrain' | 'log';
  magnitude: number; // 0-1
  description: string;
}

// ============================================
// ATOMIC MEMORY TYPES
// ============================================

export interface AtomicMemory {
  id: string;
  hash: string; // SHA-256 hash for O(1) lookup
  name: string;
  category: AtomicCategory;
  capability: string;
  inputs: Port[];
  outputs: Port[];
  compositionRules: CompositionRule[];
  resourceFootprint: number; // MB when active
  learningState: LearningState;
  version: string;
  createdAt: number;
  lastUsed: number;
  usageCount: number;
  successRate: number; // 0-1
}

export type AtomicCategory =
  | 'tool' | 'agent' | 'knowledge' | 'skill' | 'memory' | 'perception'
  | 'action' | 'reasoning' | 'communication' | 'generation';

export interface CompositionRule {
  canComposeWith: string[]; // Atomic memory IDs
  compositionType: 'chain' | 'parallel' | 'conditional' | 'merge';
  resultCapability?: string;
  constraints?: string[];
}

export interface LearningState {
  weight: number; // 0-1, how much to trust this memory
  confidence: number; // 0-1
  lastUpdated: number;
  updateHistory: LearningUpdate[];
}

export interface LearningUpdate {
  timestamp: number;
  event: string;
  weightChange: number;
  reason: string;
}

// ============================================
// RESOURCE MANAGER TYPES
// ============================================

export interface SystemSpecs {
  cpu: { cores: number; speed: number; model: string };
  ram: { total: number; available: number }; // MB
  gpu: { model: string; vram: number; compute: number }; // MB, TFLOPS
  disk: { total: number; available: number; type: 'ssd' | 'hdd' | 'nvme' }; // MB
  network: { speed: number; latency: number }; // Mbps, ms
}

export interface ResourceBudget {
  totalRam: number; // MB
  totalGpu: number; // MB
  totalCpu: number; // %
  reservedForSystem: number; // MB
  availableForReasoning: number; // MB
}

export interface ActiveSegment {
  patternId: string;
  atomicMemories: string[];
  resourceAllocation: ResourceAllocation;
  state: 'active' | 'loading' | 'sleeping' | 'preloading';
  lastAccessed: number;
  predictedNextUse: number;
  priority: number; // 0-1
}

export interface ResourceAllocation {
  ram: number; // MB
  gpu: number; // MB
  vram: number; // MB
  cpu: number; // %
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Prediction {
  nextLikelyPatterns: Array<{ patternId: string; probability: number }>;
  nextLikelyMemories: Array<{ memoryId: string; probability: number }>;
  contextSignals: string[];
  confidence: number;
}

// ============================================
// MULTI-MODAL I/O TYPES
// ============================================

export interface InputPathway {
  id: string;
  type: 'microphone' | 'camera' | 'screen' | 'image' | 'text' | 'file';
  processingPipeline: ProcessingStep[];
  resourceRequirements: ResourceSpec;
  outputFormat: DataType;
}

export interface OutputPathway {
  id: string;
  type: 'speakers' | 'display' | 'file' | 'network';
  processingPipeline: ProcessingStep[];
  resourceRequirements: ResourceSpec;
  inputFormat: DataType;
}

export interface ProcessingStep {
  id: string;
  name: string;
  operation: string;
  atomicMemoryId?: string;
  parameters?: Record<string, any>;
}

// ============================================
// LEARNING LOOP TYPES
// ============================================

export interface LearningEvent {
  id: string;
  timestamp: number;
  type: 'success' | 'failure' | 'correction' | 'timeout' | 'user-feedback';
  context: string;
  patternIds: string[];
  atomicMemoryIds: string[];
  outcome: 'positive' | 'negative' | 'neutral';
  magnitude: number; // 0-1
  details: string;
}

export interface LearningAdjustment {
  targetId: string; // Pattern or memory ID
  targetType: 'pattern' | 'memory';
  adjustment: number; // -1 to 1
  reason: string;
  timestamp: number;
}

// ============================================
// EXECUTOR INTERFACE TYPES
// ============================================

export interface ExecutorSpec {
  modelSize: string; // e.g., "0.5B"
  architecture: string; // e.g., "transformer"
  graphTraversalAlgorithm: TraversalAlgorithm;
  memoryManagement: MemoryManagementStrategy;
  resourceBudget: ResourceBudget;
  outputFormat: 'text' | 'audio' | 'image' | 'video' | 'code' | 'any';
}

export interface TraversalAlgorithm {
  name: string;
  type: 'graph-walk' | 'attention-based' | 'reinforcement' | 'hybrid';
  parameters: Record<string, any>;
  description: string;
}

export interface MemoryManagementStrategy {
  type: 'lru' | 'lfu' | 'predictive' | 'hybrid';
  maxActiveSegments: number;
  preloadingEnabled: boolean;
  compressionEnabled: boolean;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface ReasoningContext {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  userInput: string;
  activePatterns: string[];
  activeMemories: string[];
  mergedContexts: string[]; // IDs of merged contexts
  resourceUsage: ResourceAllocation;
  predictedNext: Prediction;
  learningEvents: LearningEvent[];
}

// ============================================
// GRAPH TYPES
// ============================================

export interface ReasoningGraph {
  metadata: Record<string, any>;
  patterns: ReasoningPattern[];
  atomicMemories: AtomicMemory[];
  edges: ReasoningEdge[];
  executorSpec: ExecutorSpec;
}

export interface ReasoningEdge {
  from: string; // Pattern or memory ID
  to: string;
  type: 'composition' | 'dependency' | 'learning' | 'resource';
  weight: number; // 0-1
  condition?: string;
}
