
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Analytics from './components/AnalyticsPanel';
import { loadWorkflow, saveWorkflow } from './utils/workflowUtils';

import './App.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [undoStack, setUndoStack] = useState([]); 

  useEffect(() => {
    const savedWorkflow = loadWorkflow();
    if (savedWorkflow) {
      setNodes(savedWorkflow.nodes);
      setConnections(savedWorkflow.connections);
    }
  }, []);

  const handleSave = () => {
    saveWorkflow({ nodes, connections });
  };

  const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const handleNodeDrop = (node, position) => {
    setUndoStack((prevStack) => [...prevStack, { nodes, connections }]); 
    setNodes((prevNodes) => [
      ...prevNodes,
      { ...node, position },
    ]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setUndoStack([...undoStack]); 
      setNodes(lastState.nodes);
      setConnections(lastState.connections);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="app">
          <header className="app-header">
            <nav>
              <Link to="/">Canvas</Link>
              <Link to="/analytics">Analytics</Link>
              <button onClick={handleSave}>Save Workflow</button>
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
              <button onClick={handleUndo}>Undo</button> 
            </nav>
          </header>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="workflow">
                    <Sidebar nodes={nodes} setNodes={setNodes} />
                    <Canvas
                      nodes={nodes}
                      setNodes={setNodes}
                      connections={connections}
                      setConnections={setConnections}
                      zoom={zoom}
                      setZoom={setZoom}
                      onNodeDrop={handleNodeDrop} 
                    />
                  </div>
                }
              />
              <Route
                path="/analytics"
                element={<Analytics nodes={nodes} connections={connections} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
