import React, { useState, useCallback } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { Ec2, Securitygroup, Rds } from './nodetypes';
import 'reactflow/dist/style.css';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const initialNodes = [
  { id: '1', type: 'ec2', data: { label: 'Node 1', color: 'lightblue' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'sg', data: { label: 'Node 2', color: 'lightgreen' }, position: { x: 300, y: 100 } },
]
const nodeTypes = {
  ec2: Ec2,
  sg: Securitygroup
};
export default function AwsGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const toggleColor = () => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        // label: 'sharath',
        color: node.data.color === 'lightblue' ? 'lightgreen' : 'lightblue',
      },
    }));
    console.log('update color')
    setNodes(updatedNodes);
  };
  // const updateGraphData = () => {
  //   const newElements = [...nodes, { id: 'new-node', type: 'default', data: { label: 'New Node' }, position: { x: 100, y: 100 } }];
  //   setNodes(newElements);
  // };
  const onConnect = useCallback(
    (params) => setEdges((eds) => { console.log('inside on connect'); addEdge(params, eds)}),
    [setEdges],
  );
  
  return (
    <div style={{ width: '58vw', height: '95vh' }}>
      {/* <button onClick={updateGraphData}>add</button> */}
      <button onClick={toggleColor}>Toggle Color</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // elements={elements}
        // onConnect={onConnect}
        // onDelete={onDelete}
        // onElementClick={onElementClick}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}