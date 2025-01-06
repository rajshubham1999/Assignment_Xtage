
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Node from "./Node";
import "./Canvas.css";

const Canvas = ({ nodes, setNodes, zoom, connectMode }) => {
  const [lines, setLines] = useState([]);
  const [drawingLine, setDrawingLine] = useState(null);

  const [, drop] = useDrop(() => ({
    accept: "node",
    drop: (item, monitor) => {
      if (!connectMode) {
        
        const offset = monitor.getClientOffset();
        const canvasRect = document.querySelector(".canvas").getBoundingClientRect();

        if (!offset || !canvasRect) return;

        if (!item.isNew) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === item.id
                ? {
                    ...node,
                    position: {
                      x: offset.x - canvasRect.left,
                      y: offset.y - canvasRect.top,
                    },
                  }
                : node
            )
          );
        } else {
          const newNode = {
            ...item,
            id: `${item.id}-${Date.now()}`,
            position: {
              x: offset.x - canvasRect.left,
              y: offset.y - canvasRect.top,
            },
            isNew: false,
          };
          setNodes((prevNodes) => [...prevNodes, newNode]);
        }
      }
    },
  }));

  const handleMouseMove = (e) => {
    if (drawingLine) {
      const canvasRect = document.querySelector(".canvas").getBoundingClientRect();
      setDrawingLine({
        ...drawingLine,
        to: {
          x: e.clientX - canvasRect.left,
          y: e.clientY - canvasRect.top,
        },
      });
    }
  };

  const handleMouseUp = (nodeId) => {
    if (drawingLine && drawingLine.from !== nodeId) {
      setLines((prevLines) => [
        ...prevLines,
        { from: drawingLine.from, to: nodeId },
      ]);
    }
    setDrawingLine(null);
  };

  return (
    <div
      ref={drop}
      className="canvas"
      style={{ transform: `scale(${zoom})` }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDrawingLine(null)} 
    >
      
      {lines.map((line, index) => {
        const fromNode = nodes.find((node) => node.id === line.from);
        const toNode = nodes.find((node) => node.id === line.to);

        if (!fromNode || !toNode) return null;

        return (
          <svg key={index} className="line">
            <line
              x1={fromNode.position.x + 75} 
              y1={fromNode.position.y + 50} 
              x2={toNode.position.x + 75} 
              y2={toNode.position.y + 50} 
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        );
      })}

      
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          setNodes={setNodes}
          onMouseUp={() => handleMouseUp(node.id)}
          setDrawingLine={setDrawingLine}
          connectMode={connectMode}
        />
      ))}

     
      {drawingLine && drawingLine.to && (
        <svg className="line-preview">
          <line
            x1={drawingLine.start.x}
            y1={drawingLine.start.y}
            x2={drawingLine.to.x}
            y2={drawingLine.to.y}
            stroke="blue"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}
    </div>
  );
};

export default Canvas;







