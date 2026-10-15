export interface ProjectNode {
  id: string;
  label: string;
  type: 'file' | 'component' | 'data-module' | 'export' | 'ui-element';
  category: string;
  description: string;
  connections: string[];
  metadata: Record<string, any>;
}

export interface ProjectEdge {
  from: string;
  to: string;
  type: 'imports' | 'renders' | 'exports' | 'data-flow' | 'ui-event';
  weight: number;
}

export const projectNodes: ProjectNode[] = [
  // Entry Points
  { id: 'index-html', label: 'index.html', type: 'file', category: 'entry', description: 'HTML entry point with dark mode styles', connections: ['main-tsx'], metadata: { lines: 98 } },
  { id: 'main-tsx', label: 'main.tsx', type: 'file', category: 'entry', description: 'React entry point, mounts App component', connections: ['app-tsx', 'index-css'], metadata: { role: 'bootstrap' } },
  { id: 'index-css', label: 'index.css', type: 'file', category: 'entry', description: 'Global styles, Tailwind imports, dark theme', connections: [], metadata: { framework: 'tailwind' } },

  // Main App
  { id: 'app-tsx', label: 'App.tsx', type: 'component', category: 'core', description: 'Main application component with 3 view modes', connections: ['data-index', 'view-graph', 'view-table', 'view-comparison', 'download-handlers'], metadata: { stateVars: 4, viewModes: ['graph', 'table', 'comparison'] } },

  // View Components (inline in App)
  { id: 'view-graph', label: 'Graph View', type: 'ui-element', category: 'view', description: 'SVG-based node visualization with click interactions', connections: ['node-detail-panel'], metadata: { type: 'svg', interactive: true } },
  { id: 'view-table', label: 'Table View', type: 'ui-element', category: 'view', description: 'Sortable table of all nodes with confidence bars', connections: [], metadata: { type: 'table', filterable: true } },
  { id: 'view-comparison', label: 'Comparison View', type: 'ui-element', category: 'view', description: 'Category-by-category accuracy ratings and gap analysis', connections: [], metadata: { type: 'dashboard', metrics: ['graphify-score', 'resolved', 'missing'] } },
  { id: 'node-detail-panel', label: 'Node Detail Panel', type: 'ui-element', category: 'view', description: 'Side panel showing selected node metadata', connections: [], metadata: { type: 'sidebar', dynamic: true } },

  // Data Modules
  { id: 'data-index', label: 'data/index.ts', type: 'data-module', category: 'data', description: 'Aggregates all data, provides export functions', connections: ['data-types', 'data-tokenizer', 'data-embedding', 'data-attention', 'data-feedforward', 'data-reasoning', 'data-builder', 'data-context', 'data-training-inference', 'data-safety-tools', 'data-comparison'], metadata: { role: 'aggregator', exports: ['fullGraphData', 'exportAsJSON', 'exportAsDot', 'exportAsMermaid'] } },
  { id: 'data-types', label: 'data/types.ts', type: 'data-module', category: 'data', description: 'TypeScript interfaces for GraphNode, GraphEdge, etc.', connections: [], metadata: { role: 'type-definitions', types: 8 } },
  { id: 'data-tokenizer', label: 'data/tokenizer.ts', type: 'data-module', category: 'data', description: 'BPE tokenizer, special tokens, multilingual support', connections: ['data-types'], metadata: { nodes: 4, edges: 4, confidence: 0.92 } },
  { id: 'data-embedding', label: 'data/embedding.ts', type: 'data-module', category: 'data', description: 'Token embeddings, RoPE, YaRN scaling', connections: ['data-types'], metadata: { nodes: 4, edges: 5, confidence: 0.88 } },
  { id: 'data-attention', label: 'data/attention.ts', type: 'data-module', category: 'data', description: 'GQA, Flash Attention, KV Cache, sliding window', connections: ['data-types'], metadata: { nodes: 8, edges: 8, confidence: 0.90 } },
  { id: 'data-feedforward', label: 'data/feedforward.ts', type: 'data-module', category: 'data', description: 'MoE router, 128 experts, SwiGLU, shared expert', connections: ['data-types'], metadata: { nodes: 7, edges: 7, confidence: 0.85 } },
  { id: 'data-reasoning', label: 'data/reasoning.ts', type: 'data-module', category: 'data', description: 'Think/NoThink modes, CoT generation, self-refinement', connections: ['data-types'], metadata: { nodes: 8, edges: 8, confidence: 0.72 } },
  { id: 'data-builder', label: 'data/builder.ts', type: 'data-module', category: 'data', description: 'Response generation, formatting, tool calls, streaming', connections: ['data-types'], metadata: { nodes: 8, edges: 7, confidence: 0.78 } },
  { id: 'data-context', label: 'data/context.ts', type: 'data-module', category: 'data', description: '128K window, conversation history, RAG, compression', connections: ['data-types'], metadata: { nodes: 6, edges: 5, confidence: 0.80 } },
  { id: 'data-training-inference', label: 'data/training-inference.ts', type: 'data-module', category: 'data', description: 'Training pipeline + inference engine components', connections: ['data-types'], metadata: { nodes: 11, edges: 9, confidence: 0.82 } },
  { id: 'data-safety-tools', label: 'data/safety-tools.ts', type: 'data-module', category: 'data', description: 'Safety guardrails + tool integration components', connections: ['data-types'], metadata: { nodes: 11, edges: 11, confidence: 0.74 } },
  { id: 'data-comparison', label: 'data/comparison.ts', type: 'data-module', category: 'data', description: 'Category-by-category accuracy ratings and gap analysis', connections: ['data-types'], metadata: { categories: 11, overallScore: 81.4 } },

  // Export Handlers
  { id: 'download-handlers', label: 'Download Handlers', type: 'export', category: 'export', description: 'JSON, DOT (Graphviz), Mermaid export functions', connections: ['export-json', 'export-dot', 'export-mermaid'], metadata: { formats: 3 } },
  { id: 'export-json', label: 'exportAsJSON()', type: 'export', category: 'export', description: 'Full graph data as structured JSON', connections: ['data-index'], metadata: { format: 'json', size: 'full' } },
  { id: 'export-dot', label: 'exportAsDot()', type: 'export', category: 'export', description: 'Graphviz DOT format for visualization tools', connections: ['data-index'], metadata: { format: 'dot', compatible: ['graphviz', 'neato'] } },
  { id: 'export-mermaid', label: 'exportAsMermaid()', type: 'export', category: 'export', description: 'Mermaid diagram syntax for markdown rendering', connections: ['data-index'], metadata: { format: 'mermaid', compatible: ['github', 'notion', 'obsidian'] } },
];

export const projectEdges: ProjectEdge[] = [
  // Entry flow
  { from: 'index-html', to: 'main-tsx', type: 'imports', weight: 1.0 },
  { from: 'main-tsx', to: 'app-tsx', type: 'renders', weight: 1.0 },
  { from: 'main-tsx', to: 'index-css', type: 'imports', weight: 0.8 },

  // App to views
  { from: 'app-tsx', to: 'view-graph', type: 'renders', weight: 1.0 },
  { from: 'app-tsx', to: 'view-table', type: 'renders', weight: 0.9 },
  { from: 'app-tsx', to: 'view-comparison', type: 'renders', weight: 0.9 },
  { from: 'app-tsx', to: 'node-detail-panel', type: 'renders', weight: 0.8 },
  { from: 'app-tsx', to: 'download-handlers', type: 'ui-event', weight: 0.7 },

  // App to data
  { from: 'app-tsx', to: 'data-index', type: 'imports', weight: 1.0 },

  // Data aggregation
  { from: 'data-index', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-index', to: 'data-tokenizer', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-embedding', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-attention', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-feedforward', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-reasoning', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-builder', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-context', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-training-inference', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-safety-tools', type: 'imports', weight: 0.9 },
  { from: 'data-index', to: 'data-comparison', type: 'imports', weight: 0.9 },

  // Data modules to types
  { from: 'data-tokenizer', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-embedding', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-attention', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-feedforward', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-reasoning', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-builder', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-context', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-training-inference', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-safety-tools', to: 'data-types', type: 'imports', weight: 1.0 },
  { from: 'data-comparison', to: 'data-types', type: 'imports', weight: 1.0 },

  // Export handlers
  { from: 'download-handlers', to: 'export-json', type: 'ui-event', weight: 0.8 },
  { from: 'download-handlers', to: 'export-dot', type: 'ui-event', weight: 0.8 },
  { from: 'download-handlers', to: 'export-mermaid', type: 'ui-event', weight: 0.8 },
  { from: 'export-json', to: 'data-index', type: 'data-flow', weight: 1.0 },
  { from: 'export-dot', to: 'data-index', type: 'data-flow', weight: 1.0 },
  { from: 'export-mermaid', to: 'data-index', type: 'data-flow', weight: 1.0 },

  // View interactions
  { from: 'view-graph', to: 'node-detail-panel', type: 'ui-event', weight: 0.9 },
];

export const projectGraphify = {
  metadata: {
    name: 'Qwen3 Architecture Graph Project',
    version: '1.0.0',
    totalNodes: projectNodes.length,
    totalEdges: projectEdges.length,
    fileCount: 15,
    componentCount: 4,
    dataModules: 11,
    exportFormats: 3
  },
  nodes: projectNodes,
  edges: projectEdges,
  structure: {
    entry: ['index.html', 'main.tsx', 'index.css'],
    core: ['App.tsx'],
    data: [
      'data/types.ts',
      'data/tokenizer.ts',
      'data/embedding.ts',
      'data/attention.ts',
      'data/feedforward.ts',
      'data/reasoning.ts',
      'data/builder.ts',
      'data/context.ts',
      'data/training-inference.ts',
      'data/safety-tools.ts',
      'data/comparison.ts',
      'data/index.ts'
    ],
    views: ['Graph View', 'Table View', 'Comparison View', 'Node Detail Panel'],
    exports: ['JSON', 'DOT', 'Mermaid']
  },
  dataFlow: [
    '1. HTML loads → main.tsx bootstraps React',
    '2. App.tsx renders with state management',
    '3. data/index.ts aggregates all domain data',
    '4. Each data module imports types from types.ts',
    '5. Views consume fullGraphData for rendering',
    '6. User interactions trigger state updates',
    '7. Export handlers serialize data to download formats'
  ],
  keyFeatures: [
    '3 view modes (graph, table, comparison)',
    'Interactive node selection with detail panel',
    'Category filtering and search',
    '3 export formats (JSON, DOT, Mermaid)',
    'Confidence visualization',
    'Gap analysis dashboard'
  ]
};
