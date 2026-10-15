/**
 * QWEN4 REASONING ENGINE - RESOURCE MANAGER
 * 
 * Manages system resources like a video game engine:
 * - Reads PC specs and adapts
 * - Predictive pre-loading of reasoning segments
 * - Quick-swap between contexts
 * - Sleep/wake management for unused segments
 * - Context merging for faster reasoning
 */

import { SystemSpecs, ResourceBudget, ActiveSegment, Prediction, ResourceAllocation } from './types';

export class ResourceManager {
  private systemSpecs: SystemSpecs;
  private budget: ResourceBudget;
  private activeSegments: Map<string, ActiveSegment> = new Map();
  private sleepingSegments: Map<string, ActiveSegment> = new Map();
  private contextHistory: string[] = [];
  private predictionModel: PredictionModel;

  constructor() {
    this.systemSpecs = this.detectSystemSpecs();
    this.budget = this.calculateBudget();
    this.predictionModel = new PredictionModel();
  }

  // ============================================
  // SYSTEM SPEC DETECTION
  // ============================================

  private detectSystemSpecs(): SystemSpecs {
    // In browser environment, we use navigator and performance APIs
    // In Node.js, we'd use os module
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      return {
        cpu: {
          cores: navigator.hardwareConcurrency || 4,
          speed: this.estimateCpuSpeed(),
          model: 'Browser-detected'
        },
        ram: {
          total: (navigator as any).deviceMemory ? (navigator as any).deviceMemory * 1024 : 8192,
          available: (navigator as any).deviceMemory ? (navigator as any).deviceMemory * 1024 : 8192
        },
        gpu: {
          model: this.detectGpu(),
          vram: this.estimateVram(),
          compute: this.estimateGpuCompute()
        },
        disk: {
          total: 500000, // 500GB estimate
          available: 250000, // 250GB estimate
          type: 'ssd'
        },
        network: {
          speed: 100, // 100 Mbps estimate
          latency: 50 // 50ms estimate
        }
      };
    } else {
      // Node.js environment - return defaults
      return {
        cpu: {
          cores: 4,
          speed: 3000,
          model: 'Unknown'
        },
        ram: {
          total: 8192,
          available: 8192
        },
        gpu: {
          model: 'Unknown',
          vram: 0,
          compute: 0
        },
        disk: {
          total: 500000,
          available: 250000,
          type: 'ssd'
        },
        network: {
          speed: 100,
          latency: 50
        }
      };
    }
  }

  private estimateCpuSpeed(): number {
    // Estimate CPU speed based on performance API
    if (typeof performance !== 'undefined') {
      const start = performance.now();
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += Math.sqrt(i);
      }
      const duration = performance.now() - start;
      return Math.round(1000 / duration * 100); // Rough estimate
    }
    return 3000; // Default 3GHz
  }

  private detectGpu(): string {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          return (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    }
    return 'Unknown GPU';
  }

  private estimateVram(): number {
    // Estimate VRAM based on GPU capabilities
    const gpu = this.detectGpu();
    if (gpu.includes('RTX') || gpu.includes('RX 6')) return 8192;
    if (gpu.includes('GTX') || gpu.includes('RX 5')) return 4096;
    if (gpu.includes('Integrated')) return 1024;
    return 2048; // Default 2GB
  }

  private estimateGpuCompute(): number {
    // Estimate GPU compute in TFLOPS
    const gpu = this.detectGpu();
    if (gpu.includes('RTX 4')) return 40;
    if (gpu.includes('RTX 3')) return 20;
    if (gpu.includes('GTX 1')) return 10;
    return 5; // Default 5 TFLOPS
  }

  // ============================================
  // BUDGET CALCULATION
  // ============================================

  private calculateBudget(): ResourceBudget {
    const totalRam = this.systemSpecs.ram.total;
    const totalGpu = this.systemSpecs.gpu.vram;
    const totalCpu = 100; // 100% of CPU
    
    // Reserve 30% for system
    const reservedForSystem = totalRam * 0.3;
    const availableForReasoning = totalRam - reservedForSystem;

    return {
      totalRam,
      totalGpu,
      totalCpu,
      reservedForSystem,
      availableForReasoning
    };
  }

  // ============================================
  // SEGMENT MANAGEMENT
  // ============================================

  activateSegment(patternId: string, atomicMemories: string[], resourceAllocation: ResourceAllocation): void {
    const segment: ActiveSegment = {
      patternId,
      atomicMemories,
      resourceAllocation,
      state: 'active',
      lastAccessed: Date.now(),
      predictedNextUse: this.predictNextUse(patternId),
      priority: this.calculatePriority(patternId)
    };

    this.activeSegments.set(patternId, segment);
    this.contextHistory.push(patternId);
  }

  deactivateSegment(patternId: string): void {
    const segment = this.activeSegments.get(patternId);
    if (segment) {
      segment.state = 'sleeping';
      this.sleepingSegments.set(patternId, segment);
      this.activeSegments.delete(patternId);
    }
  }

  preloadSegment(patternId: string, atomicMemories: string[], resourceAllocation: ResourceAllocation): void {
    const segment: ActiveSegment = {
      patternId,
      atomicMemories,
      resourceAllocation,
      state: 'preloading',
      lastAccessed: Date.now(),
      predictedNextUse: Date.now() + 5000, // Predicted to be used in 5 seconds
      priority: this.calculatePriority(patternId)
    };

    this.sleepingSegments.set(patternId, segment);
  }

  // ============================================
  // PREDICTIVE PRE-LOADING
  // ============================================

  predictNextUse(patternId: string): number {
    // Analyze context history to predict when this pattern will be needed
    const recentHistory = this.contextHistory.slice(-10);
    const lastUsedIndex = recentHistory.lastIndexOf(patternId);
    
    if (lastUsedIndex === -1) {
      return Date.now() + 60000; // Not used recently, predict 1 minute from now
    }

    // Calculate average interval between uses
    const intervals: number[] = [];
    for (let i = 1; i < recentHistory.length; i++) {
      if (recentHistory[i] === patternId) {
        intervals.push(i - lastUsedIndex);
      }
    }

    if (intervals.length === 0) {
      return Date.now() + 30000; // Default 30 seconds
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Date.now() + (avgInterval * 1000); // Convert to milliseconds
  }

  calculatePriority(patternId: string): number {
    // Priority based on:
    // 1. Recent usage frequency
    // 2. User-defined importance
    // 3. Predicted next use
    
    const recentUsage = this.contextHistory.filter(id => id === patternId).length;
    const frequencyScore = Math.min(recentUsage / 10, 1); // Normalize to 0-1
    
    const timeUntilNextUse = this.predictNextUse(patternId) - Date.now();
    const urgencyScore = Math.max(0, 1 - (timeUntilNextUse / 60000)); // More urgent if sooner
    
    return (frequencyScore * 0.5) + (urgencyScore * 0.5);
  }

  generatePrediction(currentContext: string): Prediction {
    return this.predictionModel.predict(currentContext, this.contextHistory);
  }

  // ============================================
  // QUICK-SWAP & CONTEXT MERGING
  // ============================================

  quickSwap(fromPatternId: string, toPatternId: string, toAtomicMemories: string[], toResourceAllocation: ResourceAllocation): void {
    // Deactivate old pattern
    this.deactivateSegment(fromPatternId);
    
    // Activate new pattern
    this.activateSegment(toPatternId, toAtomicMemories, toResourceAllocation);
  }

  mergeContexts(contexts: string[]): string {
    // Merge multiple contexts into one for faster reasoning
    // This is a simplified version - in production, this would be more sophisticated
    return contexts.join('_merged_');
  }

  // ============================================
  // RESOURCE MONITORING
  // ============================================

  getCurrentResourceUsage(): ResourceAllocation {
    let totalRam = 0;
    let totalCpu = 0;
    let totalGpu = 0;
    let totalVram = 0;

    this.activeSegments.forEach(segment => {
      totalRam += segment.resourceAllocation.ram;
      totalCpu += segment.resourceAllocation.cpu;
      totalGpu += segment.resourceAllocation.gpu;
      totalVram += segment.resourceAllocation.vram;
    });

    return {
      ram: totalRam,
      cpu: totalCpu,
      gpu: totalGpu,
      vram: totalVram,
      priority: 'medium'
    };
  }

  canAllocateResources(required: ResourceAllocation): boolean {
    const current = this.getCurrentResourceUsage();
    
    return (
      current.ram + required.ram <= this.budget.availableForReasoning &&
      current.cpu + required.cpu <= this.budget.totalCpu &&
      current.gpu + required.gpu <= this.budget.totalGpu &&
      current.vram + required.vram <= this.budget.totalGpu
    );
  }

  // ============================================
  // SLEEP/WAKE MANAGEMENT
  // ============================================

  sleepUnusedSegments(): void {
    const now = Date.now();
    const threshold = 30000; // 30 seconds

    this.activeSegments.forEach((segment, patternId) => {
      if (now - segment.lastAccessed > threshold) {
        this.deactivateSegment(patternId);
      }
    });
  }

  wakePredictedSegments(): void {
    const now = Date.now();
    const threshold = 5000; // 5 seconds before predicted use

    this.sleepingSegments.forEach((segment, patternId) => {
      if (segment.predictedNextUse - now < threshold && segment.state === 'preloading') {
        segment.state = 'active';
        this.activeSegments.set(patternId, segment);
        this.sleepingSegments.delete(patternId);
      }
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getSystemSpecs(): SystemSpecs {
    return this.systemSpecs;
  }

  getBudget(): ResourceBudget {
    return this.budget;
  }

  getActiveSegments(): Map<string, ActiveSegment> {
    return this.activeSegments;
  }

  getSleepingSegments(): Map<string, ActiveSegment> {
    return this.sleepingSegments;
  }
}

// ============================================
// PREDICTION MODEL
// ============================================

class PredictionModel {
  private transitionMatrix: Map<string, Map<string, number>> = new Map();

  predict(currentContext: string, history: string[]): Prediction {
    // Simple Markov chain prediction
    // In production, this would be a more sophisticated ML model
    
    const nextLikelyPatterns: Array<{ patternId: string; probability: number }> = [];
    const nextLikelyMemories: Array<{ memoryId: string; probability: number }> = [];

    // Analyze recent history
    const recentHistory = history.slice(-5);
    
    // Count transitions
    for (let i = 1; i < recentHistory.length; i++) {
      const from = recentHistory[i - 1];
      const to = recentHistory[i];
      
      if (!this.transitionMatrix.has(from)) {
        this.transitionMatrix.set(from, new Map());
      }
      
      const transitions = this.transitionMatrix.get(from)!;
      transitions.set(to, (transitions.get(to) || 0) + 1);
    }

    // Predict next patterns based on current context
    const currentTransitions = this.transitionMatrix.get(currentContext);
    if (currentTransitions) {
      const total = Array.from(currentTransitions.values()).reduce((a, b) => a + b, 0);
      
      currentTransitions.forEach((count, patternId) => {
        nextLikelyPatterns.push({
          patternId,
          probability: count / total
        });
      });

      // Sort by probability
      nextLikelyPatterns.sort((a, b) => b.probability - a.probability);
    }

    return {
      nextLikelyPatterns: nextLikelyPatterns.slice(0, 5), // Top 5
      nextLikelyMemories, // Would be populated similarly
      contextSignals: [currentContext],
      confidence: nextLikelyPatterns.length > 0 ? nextLikelyPatterns[0].probability : 0.5
    };
  }
}

export const resourceManager = new ResourceManager();
