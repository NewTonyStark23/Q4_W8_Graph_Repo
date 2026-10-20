/**
 * QWEN4 REASONING ENGINE - MAIN AGGREGATOR
 * 
 * Combines all reasoning engine components into a complete system.
 * This is the entry point for the reasoning engine.
 */

import { ReasoningGraph } from './types';
import { reasoningPatterns } from './reasoning-patterns';
import { atomicMemories } from './atomic-memories';
import { resourceManager } from './resource-manager';
import { inputPathways, outputPathways } from './multimodal-io';
import { initializeLearningLoop, LearningLoop } from './learning-loop';
import { initializeExecutor, Executor, executorSpec } from './executor-interface';

// ============================================
// REASONING GRAPH CONSTRUCTION
// ============================================

export const reasoningGraph: ReasoningGraph = {
  metadata: {
    name: 'Qwen4 Reasoning Engine',
    version: '1.0.0',
    description: 'Pre-compressed reasoning engine with 161 components',
    totalPatterns: reasoningPatterns.length,
    totalAtomicMemories: atomicMemories.length,
    totalInputPathways: inputPathways.length,
    totalOutputPathways: outputPathways.length,
    executorModelSize: executorSpec.modelSize,
    createdAt: Date.now()
  },
  patterns: reasoningPatterns,
  atomicMemories: atomicMemories,
  edges: generateEdges(),
  executorSpec: executorSpec
};

function generateEdges(): any[] {
  const edges: any[] = [];

  // Generate edges from pattern composability rules
  reasoningPatterns.forEach(pattern => {
    pattern.composabilityRules.forEach(rule => {
      rule.canComposeWith.forEach(targetId => {
        edges.push({
          from: pattern.id,
          to: targetId,
          type: 'composition',
          weight: 0.8,
          condition: rule.compositionType
        });
      });
    });

    // Generate edges from atomic memory dependencies
    pattern.atomicMemories.forEach(memoryId => {
      edges.push({
        from: pattern.id,
        to: memoryId,
        type: 'dependency',
        weight: 0.9
      });
    });
  });

  // Generate edges from atomic memory composition rules
  atomicMemories.forEach(memory => {
    memory.compositionRules.forEach(rule => {
      rule.canComposeWith.forEach(targetId => {
        edges.push({
          from: memory.id,
          to: targetId,
          type: 'composition',
          weight: 0.7
        });
      });
    });
  });

  return edges;
}

// ============================================
// SYSTEM INITIALIZATION
// ============================================

let learningLoopInstance: LearningLoop | null = null;
let executorInstance: Executor | null = null;

export function initializeReasoningEngine(): {
  graph: ReasoningGraph;
  learningLoop: LearningLoop;
  executor: Executor;
} {
  // Initialize learning loop
  learningLoopInstance = initializeLearningLoop(reasoningPatterns, atomicMemories);

  // Initialize executor
  executorInstance = initializeExecutor(reasoningGraph);

  return {
    graph: reasoningGraph,
    learningLoop: learningLoopInstance,
    executor: executorInstance
  };
}

// ============================================
// QUERY EXECUTION
// ============================================

export async function executeQuery(query: string, userId: string = 'default', sessionId: string = 'default'): Promise<string> {
  if (!executorInstance) {
    initializeReasoningEngine();
  }

  return executorInstance!.executeQuery(query, userId, sessionId);
}

// ============================================
// LEARNING INTEGRATION
// ============================================

export function recordSuccess(patternIds: string[], memoryIds: string[], context: string): void {
  if (!learningLoopInstance) {
    initializeReasoningEngine();
  }
  learningLoopInstance!.recordSuccess(patternIds, memoryIds, context);
}

export function recordFailure(patternIds: string[], memoryIds: string[], context: string): void {
  if (!learningLoopInstance) {
    initializeReasoningEngine();
  }
  learningLoopInstance!.recordFailure(patternIds, memoryIds, context);
}

export function recordUserCorrection(patternIds: string[], memoryIds: string[], context: string, correction: string): void {
  if (!learningLoopInstance) {
    initializeReasoningEngine();
  }
  learningLoopInstance!.recordUserCorrection(patternIds, memoryIds, context, correction);
}

// ============================================
// RESOURCE MANAGEMENT
// ============================================

export function getSystemSpecs() {
  return resourceManager.getSystemSpecs();
}

export function getResourceBudget() {
  return resourceManager.getBudget();
}

export function getActiveSegments() {
  return resourceManager.getActiveSegments();
}

export function getCurrentResourceUsage() {
  return resourceManager.getCurrentResourceUsage();
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

export function getReasoningEngineStats() {
  return {
    totalPatterns: reasoningPatterns.length,
    totalAtomicMemories: atomicMemories.length,
    totalEdges: reasoningGraph.edges.length,
    totalInputPathways: inputPathways.length,
    totalOutputPathways: outputPathways.length,
    patternCategories: [...new Set(reasoningPatterns.map(p => p.category))],
    memoryCategories: [...new Set(atomicMemories.map(m => m.category))],
    executorModelSize: executorSpec.modelSize,
    systemSpecs: resourceManager.getSystemSpecs(),
    resourceBudget: resourceManager.getBudget(),
    currentResourceUsage: resourceManager.getCurrentResourceUsage()
  };
}

export function getLearningStats() {
  if (!learningLoopInstance) {
    return {
      totalEvents: 0,
      successRate: 0,
      totalAdjustments: 0,
      averageAdjustment: 0
    };
  }
  return learningLoopInstance.getStatistics();
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

export function exportReasoningGraph(): string {
  return JSON.stringify(reasoningGraph, null, 2);
}

export function exportLearningData(): string {
  if (!learningLoopInstance) {
    return JSON.stringify({ events: [], adjustments: [] }, null, 2);
  }
  return JSON.stringify(learningLoopInstance.exportLearningData(), null, 2);
}

export function exportAllData(): string {
  return JSON.stringify({
    graph: reasoningGraph,
    learning: learningLoopInstance ? learningLoopInstance.exportLearningData() : { events: [], adjustments: [] },
    stats: getReasoningEngineStats(),
    learningStats: getLearningStats()
  }, null, 2);
}

// ============================================
// VISUALIZATION DATA
// ============================================

export function getVisualizationData() {
  return {
    nodes: [
      ...reasoningPatterns.map(p => ({
        id: p.id,
        label: p.name,
        category: p.category,
        type: 'pattern',
        confidence: p.confidence,
        weight: 0.8
      })),
      ...atomicMemories.map(m => ({
        id: m.id,
        label: m.name,
        category: m.category,
        type: 'memory',
        confidence: m.learningState.confidence,
        weight: m.learningState.weight
      }))
    ],
    edges: reasoningGraph.edges,
    metadata: reasoningGraph.metadata
  };
}

// ============================================
// RE-EXPORTS
// ============================================

export * from './types';
export { reasoningPatterns } from './reasoning-patterns';
export { atomicMemories } from './atomic-memories';
export { resourceManager } from './resource-manager';
export { inputPathways, outputPathways } from './multimodal-io';
export { initializeLearningLoop } from './learning-loop';
export { initializeExecutor, executorSpec } from './executor-interface';
