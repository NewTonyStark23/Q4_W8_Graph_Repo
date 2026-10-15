import { useState, useMemo } from 'react';
import { fullGraphData, exportAsJSON, exportAsDot, exportAsMermaid } from './data';
import { GraphNode, Category } from './data/types';

const categoryColors: Record<Category, string> = {
  tokenizer: '#4CAF50',
  embedding: '#2196F3',
  attention: '#FF9800',
  feedforward: '#9C27B0',
  normalization: '#795548',
  positional: '#00BCD4',
  output: '#E91E63',
  reasoning: '#F44336',
  builder: '#3F51B5',
  context: '#009688',
  training: '#FF5722',
  inference: '#607D8B',
  safety: '#FFC107',
  'tool-use': '#8BC34A'
};

const categoryLabels: Record<Category, string> = {
  tokenizer: '🔤 Tokenizer',
  embedding: '🧩 Embeddings',
  attention: '👁️ Attention',
  feedforward: '🔀 MoE/FFN',
  normalization: '📐 Normalization',
  positional: '📍 Positional',
  output: '📤 Output',
  reasoning: '🧠 Reasoning',
  builder: '🏗️ Builder',
  context: '📋 Context',
  training: '🎓 Training',
  inference: '⚡ Inference',
  safety: '🛡️ Safety',
  'tool-use': '🔧 Tool Use'
};

const sourceIcons: Record<string, string> = {
  observed: '✅',
  inferred: '🔍',
  'gap-filled': '🧩'
};

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'table' | 'comparison'>('graph');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = useMemo(() => {
    let nodes = fullGraphData.allNodes;
    if (activeCategory !== 'all') {
      nodes = nodes.filter(n => n.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      nodes = nodes.filter(n =>
        n.label.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.id.toLowerCase().includes(term)
      );
    }
    return nodes;
  }, [activeCategory, searchTerm]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return fullGraphData.allEdges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  }, [filteredNodes]);

  const handleDownload = (format: 'json' | 'dot' | 'mermaid') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = exportAsJSON();
        filename = 'qwen3-architecture-graph.json';
        mimeType = 'application/json';
        break;
      case 'dot':
        content = exportAsDot();
        filename = 'qwen3-architecture-graph.dot';
        mimeType = 'text/plain';
        break;
      case 'mermaid':
        content = exportAsMermaid();
        filename = 'qwen3-architecture-graph.mmd';
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Qwen3 Architecture Graph
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Reverse-engineered 1:1 weight map • {fullGraphData.metadata.totalNodes} nodes • {fullGraphData.metadata.totalEdges} edges • {Math.round(fullGraphData.metadata.overallConfidence * 100)}% confidence
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDownload('json')} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                📥 JSON
              </button>
              <button onClick={() => handleDownload('dot')} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                📥 DOT
              </button>
              <button onClick={() => handleDownload('mermaid')} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                📥 Mermaid
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">{fullGraphData.overallScore.observedCount}</div>
            <div className="text-xs text-gray-400">✅ Observed</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{fullGraphData.overallScore.inferredCount}</div>
            <div className="text-xs text-gray-400">🔍 Inferred</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">{fullGraphData.overallScore.gapFilledCount}</div>
            <div className="text-xs text-gray-400">🧩 Gap-Filled</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">{fullGraphData.allNodes.reduce((sum, n) => sum + (n.weight || 0), 0).toFixed(2)}</div>
            <div className="text-xs text-gray-400">⚖️ Total Weight</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-400">{fullGraphData.overallScore.graphifyScore}%</div>
            <div className="text-xs text-gray-400">📊 Graphify Score</div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-4">
          {(['graph', 'table', 'comparison'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {mode === 'graph' ? '🕸️ Graph View' : mode === 'table' ? '📋 Table View' : '📊 Comparison'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === 'all' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            All ({fullGraphData.allNodes.length})
          </button>
          {(Object.keys(categoryLabels) as Category[]).map(cat => {
            const count = fullGraphData.allNodes.filter(n => n.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? 'text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                style={activeCategory === cat ? { backgroundColor: categoryColors[cat] } : {}}
              >
                {categoryLabels[cat]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search nodes..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Main Content */}
        {viewMode === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Visualization */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-auto max-h-[70vh]">
              <h3 className="text-lg font-semibold mb-4">Architecture Graph</h3>
              <div className="relative">
                {/* SVG Graph */}
                <svg viewBox="0 0 800 600" className="w-full h-auto">
                  {/* Edges */}
                  {filteredEdges.map((edge, i) => {
                    const fromNode = fullGraphData.allNodes.find(n => n.id === edge.from);
                    const toNode = fullGraphData.allNodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const fromIdx = filteredNodes.indexOf(fromNode);
                    const toIdx = filteredNodes.indexOf(toNode);
                    if (fromIdx === -1 || toIdx === -1) return null;

                    const cols = Math.ceil(Math.sqrt(filteredNodes.length));
                    const fromX = (fromIdx % cols) * (750 / cols) + 50;
                    const fromY = Math.floor(fromIdx / cols) * (550 / Math.ceil(filteredNodes.length / cols)) + 50;
                    const toX = (toIdx % cols) * (750 / cols) + 50;
                    const toY = Math.floor(toIdx / cols) * (550 / Math.ceil(filteredNodes.length / cols)) + 50;

                    const strokeDash = edge.type === 'gradient' ? '5,5' : edge.type === 'control-flow' ? '2,2' : 'none';
                    const color = edge.type === 'gradient' ? '#F44336' : edge.type === 'control-flow' ? '#FFC107' : '#4CAF50';

                    return (
                      <line
                        key={i}
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke={color}
                        strokeWidth={edge.weight * 2}
                        strokeDasharray={strokeDash}
                        opacity={0.4}
                      />
                    );
                  })}
                  {/* Nodes */}
                  {filteredNodes.map((node, i) => {
                    const cols = Math.ceil(Math.sqrt(filteredNodes.length));
                    const rows = Math.ceil(filteredNodes.length / cols);
                    const x = (i % cols) * (750 / cols) + 50;
                    const y = Math.floor(i / cols) * (550 / rows) + 50;
                    const color = categoryColors[node.category];
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 18 : 14}
                          fill={color}
                          opacity={node.confidence}
                          stroke={isSelected ? 'white' : 'none'}
                          strokeWidth={2}
                        />
                        <text
                          x={x}
                          y={y + 25}
                          textAnchor="middle"
                          fill="#ccc"
                          fontSize="7"
                          className="pointer-events-none"
                        >
                          {node.label.length > 15 ? node.label.slice(0, 15) + '...' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block"></span> Data Flow</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-500 inline-block" style={{borderTop: '1px dashed'}}></span> Control Flow</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" style={{borderTop: '1px dashed'}}></span> Gradient</span>
                <span className="ml-4 text-gray-500">Opacity = confidence</span>
              </div>
            </div>

            {/* Node Detail Panel */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-auto max-h-[70vh]">
              {selectedNode ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[selectedNode.category] }}></span>
                    <h3 className="text-lg font-semibold">{selectedNode.label}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">ID:</span> <code className="text-blue-300">{selectedNode.id}</code>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span> {categoryLabels[selectedNode.category]}
                    </div>
                    <div>
                      <span className="text-gray-400">Source:</span> {sourceIcons[selectedNode.source]} {selectedNode.source}
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${selectedNode.confidence * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(selectedNode.confidence * 100)}%</span>
                    </div>
                    {selectedNode.weight && (
                      <div>
                        <span className="text-gray-400">Weight:</span> {selectedNode.weight}
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <p className="mt-1 text-gray-300">{selectedNode.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Connections:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedNode.connections.map(c => (
                          <span key={c} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Metadata:</span>
                      <pre className="mt-1 text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(selectedNode.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-4xl mb-3">👆</p>
                  <p>Click a node to see details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Node</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Source</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Confidence</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Weight</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.map(node => (
                    <tr key={node.id} className="border-t border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => { setSelectedNode(node); setViewMode('graph'); }}>
                      <td className="px-4 py-3 font-medium">
                        <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: categoryColors[node.category] }}></span>
                        {node.label}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{categoryLabels[node.category]}</td>
                      <td className="px-4 py-3">{sourceIcons[node.source]} {node.source}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${node.confidence * 100}%`, backgroundColor: categoryColors[node.category] }}></div>
                          </div>
                          <span className="text-xs text-gray-400">{Math.round(node.confidence * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{node.weight || '-'}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{node.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">📊 Graphify Model vs Current Model — Comparison Rating</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-400">{fullGraphData.overallScore.graphifyScore}%</div>
                  <div className="text-sm text-gray-400 mt-2">Overall Graphify Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-400">{fullGraphData.overallScore.observedCount + fullGraphData.overallScore.inferredCount}</div>
                  <div className="text-sm text-gray-400 mt-2">Resolved Items (observed + inferred)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-400">{fullGraphData.overallScore.gapFilledCount}</div>
                  <div className="text-sm text-gray-400 mt-2">Gap-Filled Items (self-resolved)</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-400">{fullGraphData.overallScore.summary}</p>
            </div>

            {/* Per-Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullGraphData.comparison.map(comp => (
                <div key={comp.category} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{categoryLabels[comp.category]}</h4>
                    <span className={`text-lg font-bold ${comp.graphifyScore >= 85 ? 'text-green-400' : comp.graphifyScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {comp.graphifyScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${comp.graphifyScore}%`,
                        backgroundColor: comp.graphifyScore >= 85 ? '#4CAF50' : comp.graphifyScore >= 70 ? '#FFC107' : '#F44336'
                      }}
                    ></div>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-green-400">✅ Resolved:</span>
                      <span className="text-gray-400 ml-1">{comp.resolvedItems.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-red-400">❌ Missing:</span>
                      <span className="text-gray-400 ml-1">{comp.missingItems.join(', ')}</span>
                    </div>
                    <div className="text-gray-500 italic mt-2">{comp.notes}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* What's Missing Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">🔴 What's Still Missing (Can Be Resolved)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">High Priority Gaps</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Exact thinking budget algorithm (reasoning)</li>
                    <li>• Safety classifier architecture details</li>
                    <li>• Expert routing temperature specifics</li>
                    <li>• Exact data mix ratios for training</li>
                    <li>• Context compression algorithm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Resolution Strategy</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Probe thinking budget via token counting experiments</li>
                    <li>• Analyze refusal patterns to reverse safety triggers</li>
                    <li>• Measure expert utilization via activation analysis</li>
                    <li>• Compare benchmark scores to infer data composition</li>
                    <li>• Test context degradation curves for compression model</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Flow Diagram */}
        {viewMode === 'graph' && activeCategory === 'all' && (
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">🔄 Data Flow Pipeline</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {['Tokenizer', 'Embedding', 'RoPE', 'Attention (GQA)', 'MoE Router', 'Experts (×128)', 'RMSNorm', 'Reasoning Engine', 'Builder', 'Safety', 'Output'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">{step}</div>
                  {i < 10 && <span className="text-gray-600">→</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p><strong>Model:</strong> {fullGraphData.metadata.model}</p>
              <p><strong>Generated:</strong> {fullGraphData.metadata.generatedAt}</p>
              <p><strong>Format:</strong> Graphified architecture map — all weights represented as relative importance scores, all connections mapped as typed edges.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-sm text-gray-500">
        <p>Qwen3 Architecture Graph • Open Source • Reverse-engineered for research & experimentation</p>
        <p className="mt-1">Download as JSON (full data) • DOT (Graphviz) • Mermaid (diagram)</p>
      </footer>
    </div>
  );
}

export default App;
