// Core types for Qwen3 Architecture Graph
export interface GraphNode {
  id: string;
  label: string;
  category: Category;
  section: Section;
  weight?: number;
  confidence: number; // 0-1 how confident we are this is 1:1
  source: 'observed' | 'inferred' | 'gap-filled';
  description: string;
  connections: string[];
  metadata: Record<string, any>;
}

export type Category =
  | 'tokenizer'
  | 'embedding'
  | 'attention'
  | 'feedforward'
  | 'normalization'
  | 'positional'
  | 'output'
  | 'reasoning'
  | 'builder'
  | 'context'
  | 'training'
  | 'inference'
  | 'safety'
  | 'tool-use';

export type Section =
  | 'input-processing'
  | 'transformer-block'
  | 'attention-head'
  | 'mlp-block'
  | 'reasoning-chain'
  | 'builder-pattern'
  | 'context-window'
  | 'output-generation'
  | 'safety-layer'
  | 'tool-integration';

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  type: 'data-flow' | 'control-flow' | 'gradient' | 'attention-link';
}

export interface GraphSection {
  id: Section;
  category: Category;
  label: string;
  description: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  confidenceScore: number;
}

export interface ComparisonRating {
  category: Category;
  graphifyScore: number; // 0-100 how complete our graph is
  missingItems: string[];
  resolvedItems: string[];
  notes: string;
}
