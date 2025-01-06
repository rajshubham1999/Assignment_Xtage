import React from 'react';
import { useDrag } from 'react-dnd';
import './Sidebar.css';

const nodeTypes = [
  { id: 'start', label: 'Start', icon: '🚀' },
  { id: 'task', label: 'Task', icon: '📝' },
  { id: 'decision', label: 'Decision', icon: '❓' },
  { id: 'end', label: 'End', icon: '🏁' }
];

const Sidebar = ({ nodes, setNodes }) => {
  return (
    <div className="sidebar">
      <h3>Node Palette</h3>
      {nodeTypes.map((node) => (
        <DraggableNode key={node.id} node={node} />
      ))}
    </div>
  );
};

const DraggableNode = ({ node }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { ...node, isNew: true }, 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable-node ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{node.icon}</span> {node.label}
    </div>
  );
};

export default Sidebar;






