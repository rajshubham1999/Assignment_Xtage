
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import './Node.css';

const Node = ({ node, setNodes, setDrawingLine }) => {
  const nodeRef = useRef();
  const circleRef = useRef();

 
  const [, drag] = useDrag(() => ({
    type: 'node',
    item: { id: node.id },
    end: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset && nodeRef.current) {
        const canvasRect = nodeRef.current.parentElement.getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;

        setNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.id === item.id ? { ...n, position: { x, y } } : n
          )
        );
      }
    },
  }));

  
  const handleCircleMouseDown = (e) => {
    e.stopPropagation(); 

   
    const circleRect = circleRef.current.getBoundingClientRect();
    const canvasRect = nodeRef.current.parentElement.getBoundingClientRect();
    const startX = circleRect.left - canvasRect.left + circleRect.width / 2;
    const startY = circleRect.top - canvasRect.top + circleRect.height / 2;

  
    setDrawingLine({ from: node.id, to: null, start: { x: startX, y: startY } });
  };

  return (
    <div
      ref={(el) => {
        drag(el);
        nodeRef.current = el;
      }}
      className="node"
      style={{
        left: node.position.x,
        top: node.position.y,
        position: 'absolute',
      }}
    >
      <div className="node-header">
        <span>{node.icon}</span>
        <input
          type="text"
          value={node.label}
          onChange={(e) =>
            setNodes((prevNodes) =>
              prevNodes.map((n) =>
                n.id === node.id ? { ...n, label: e.target.value } : n
              )
            )
          }
          className="node-text"
        />
      </div>
      <div
        ref={circleRef} 
        className="connection-point circle"
        onMouseDown={handleCircleMouseDown} 
      />
    </div>
  );
};

export default Node;
