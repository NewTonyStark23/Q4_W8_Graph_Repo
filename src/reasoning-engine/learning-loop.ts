/**
 * QWEN4 REASONING ENGINE - LEARNING LOOP
 * 
 * Continuous learning from wins, losses, and user corrections.
 * Adjusts weights and parameters based on outcomes.
 */

import { LearningEvent, LearningAdjustment, ReasoningPattern, AtomicMemory } from './types';

export class LearningLoop {
  private events: LearningEvent[] = [];
  private adjustments: LearningAdjustment[] = [];
  private patterns: Map<string, ReasoningPattern>;
  private memories: Map<string, AtomicMemory>;

  constructor(patterns: ReasoningPattern[], memories: AtomicMemory[]) {
    this.patterns = new Map(patterns.map(p => [p.id, p]));
    this.memories = new Map(memories.map(m => [m.id, m]));
  }

  // ============================================
  // EVENT TRACKING
  // ============================================

  recordSuccess(patternIds: string[], memoryIds: string[], context: string, magnitude: number = 0.1): void {
    const event: LearningEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'success',
      context,
      patternIds,
      atomicMemoryIds: memoryIds,
      outcome: 'positive',
      magnitude,
      details: 'Successful execution'
    };

    this.events.push(event);
    this.applyAdjustments(event);
  }

  recordFailure(patternIds: string[], memoryIds: string[], context: string, magnitude: number = 0.2): void {
    const event: LearningEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'failure',
      context,
      patternIds,
      atomicMemoryIds: memoryIds,
      outcome: 'negative',
      magnitude,
      details: 'Failed execution'
    };

    this.events.push(event);
    this.applyAdjustments(event);
  }

  recordUserCorrection(patternIds: string[], memoryIds: string[], context: string, correction: string, magnitude: number = 0.3): void {
    const event: LearningEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'correction',
      context,
      patternIds,
      atomicMemoryIds: memoryIds,
      outcome: 'negative',
      magnitude,
      details: `User correction: ${correction}`
    };

    this.events.push(event);
    this.applyAdjustments(event);
  }

  recordTimeout(patternIds: string[], memoryIds: string[], context: string, magnitude: number = 0.15): void {
    const event: LearningEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'timeout',
      context,
      patternIds,
      atomicMemoryIds: memoryIds,
      outcome: 'negative',
      magnitude,
      details: 'Execution timeout'
    };

    this.events.push(event);
    this.applyAdjustments(event);
  }

  // ============================================
  // ADJUSTMENT APPLICATION
  // ============================================

  private applyAdjustments(event: LearningEvent): void {
    // Adjust pattern weights
    event.patternIds.forEach(patternId => {
      const pattern = this.patterns.get(patternId);
      if (pattern) {
        const hook = pattern.learningHooks.find(h => h.event === event.type);
        if (hook) {
          const adjustment = this.calculateAdjustment(hook, event.magnitude);
          this.applyPatternAdjustment(patternId, adjustment, event);
        }
      }
    });

    // Adjust atomic memory weights
    event.atomicMemoryIds.forEach(memoryId => {
      const memory = this.memories.get(memoryId);
      if (memory) {
        const adjustment = this.calculateMemoryAdjustment(event);
        this.applyMemoryAdjustment(memoryId, adjustment, event);
      }
    });
  }

  private calculateAdjustment(hook: any, magnitude: number): number {
    let adjustment = 0;

    switch (hook.action) {
      case 'increase-weight':
        adjustment = hook.magnitude * magnitude;
        break;
      case 'decrease-weight':
        adjustment = -hook.magnitude * magnitude;
        break;
      case 'adjust-parameter':
        adjustment = hook.magnitude * magnitude * (Math.random() - 0.5); // Random adjustment
        break;
      case 'retrain':
        adjustment = 0; // Would trigger retraining in production
        break;
      case 'log':
        adjustment = 0; // Just logging
        break;
    }

    return adjustment;
  }

  private calculateMemoryAdjustment(event: LearningEvent): number {
    switch (event.outcome) {
      case 'positive':
        return event.magnitude * 0.1;
      case 'negative':
        return -event.magnitude * 0.2;
      case 'neutral':
        return 0;
      default:
        return 0;
    }
  }

  private applyPatternAdjustment(patternId: string, adjustment: number, event: LearningEvent): void {
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      const newConfidence = Math.max(0, Math.min(1, pattern.confidence + adjustment));
      pattern.confidence = newConfidence;

      const learningAdjustment: LearningAdjustment = {
        targetId: patternId,
        targetType: 'pattern',
        adjustment,
        reason: `${event.type}: ${event.details}`,
        timestamp: Date.now()
      };

      this.adjustments.push(learningAdjustment);
    }
  }

  private applyMemoryAdjustment(memoryId: string, adjustment: number, event: LearningEvent): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      const newWeight = Math.max(0, Math.min(1, memory.learningState.weight + adjustment));
      memory.learningState.weight = newWeight;
      memory.learningState.lastUpdated = Date.now();
      memory.usageCount++;

      if (event.outcome === 'positive') {
        memory.successRate = Math.min(1, memory.successRate + 0.01);
      } else if (event.outcome === 'negative') {
        memory.successRate = Math.max(0, memory.successRate - 0.02);
      }

      memory.learningState.updateHistory.push({
        timestamp: Date.now(),
        event: event.type,
        weightChange: adjustment,
        reason: event.details
      });

      const learningAdjustment: LearningAdjustment = {
        targetId: memoryId,
        targetType: 'memory',
        adjustment,
        reason: `${event.type}: ${event.details}`,
        timestamp: Date.now()
      };

      this.adjustments.push(learningAdjustment);
    }
  }

  // ============================================
  // ANALYSIS & INSIGHTS
  // ============================================

  getSuccessRate(patternId?: string): number {
    if (patternId) {
      const patternEvents = this.events.filter(e => e.patternIds.includes(patternId));
      if (patternEvents.length === 0) return 0.5;
      const successes = patternEvents.filter(e => e.outcome === 'positive').length;
      return successes / patternEvents.length;
    }

    if (this.events.length === 0) return 0.5;
    const successes = this.events.filter(e => e.outcome === 'positive').length;
    return successes / this.events.length;
  }

  getMostSuccessfulPatterns(limit: number = 10): Array<{ patternId: string; successRate: number }> {
    const patternStats = new Map<string, { successes: number; total: number }>();

    this.events.forEach(event => {
      event.patternIds.forEach(patternId => {
        if (!patternStats.has(patternId)) {
          patternStats.set(patternId, { successes: 0, total: 0 });
        }
        const stats = patternStats.get(patternId)!;
        stats.total++;
        if (event.outcome === 'positive') {
          stats.successes++;
        }
      });
    });

    const results = Array.from(patternStats.entries()).map(([patternId, stats]) => ({
      patternId,
      successRate: stats.total > 0 ? stats.successes / stats.total : 0
    }));

    return results.sort((a, b) => b.successRate - a.successRate).slice(0, limit);
  }

  getMostUsedMemories(limit: number = 10): Array<{ memoryId: string; usageCount: number }> {
    const results = Array.from(this.memories.values()).map(memory => ({
      memoryId: memory.id,
      usageCount: memory.usageCount
    }));

    return results.sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
  }

  getRecentEvents(limit: number = 50): LearningEvent[] {
    return this.events.slice(-limit).reverse();
  }

  getRecentAdjustments(limit: number = 50): LearningAdjustment[] {
    return this.adjustments.slice(-limit).reverse();
  }

  // ============================================
  // PATTERN OPTIMIZATION
  // ============================================

  identifyUnderperformingPatterns(threshold: number = 0.5): string[] {
    const underperforming: string[] = [];

    this.patterns.forEach((pattern, patternId) => {
      const successRate = this.getSuccessRate(patternId);
      if (successRate < threshold) {
        underperforming.push(patternId);
      }
    });

    return underperforming;
  }

  identifyUnusedPatterns(daysThreshold: number = 7): string[] {
    const unused: string[] = [];
    const threshold = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);

    this.patterns.forEach((pattern, patternId) => {
      const recentEvents = this.events.filter(
        e => e.patternIds.includes(patternId) && e.timestamp > threshold
      );
      if (recentEvents.length === 0) {
        unused.push(patternId);
      }
    });

    return unused;
  }

  // ============================================
  // EXPORT & PERSISTENCE
  // ============================================

  exportLearningData(): { events: LearningEvent[]; adjustments: LearningAdjustment[] } {
    return {
      events: this.events,
      adjustments: this.adjustments
    };
  }

  importLearningData(data: { events: LearningEvent[]; adjustments: LearningAdjustment[] }): void {
    this.events = data.events;
    this.adjustments = data.adjustments;
  }

  getStatistics(): {
    totalEvents: number;
    successRate: number;
    totalAdjustments: number;
    averageAdjustment: number;
  } {
    const totalEvents = this.events.length;
    const successRate = this.getSuccessRate();
    const totalAdjustments = this.adjustments.length;
    const averageAdjustment = totalAdjustments > 0
      ? this.adjustments.reduce((sum, a) => sum + a.adjustment, 0) / totalAdjustments
      : 0;

    return {
      totalEvents,
      successRate,
      totalAdjustments,
      averageAdjustment
    };
  }
}

// Create a singleton instance
export let learningLoop: LearningLoop | null = null;

export function initializeLearningLoop(patterns: ReasoningPattern[], memories: AtomicMemory[]): LearningLoop {
  learningLoop = new LearningLoop(patterns, memories);
  return learningLoop;
}
