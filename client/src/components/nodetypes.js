import React from 'react';
import { Handle } from 'reactflow';
  
const Ec2 = ({ data }) => {
  return (
    <div style={{ border: '1px solid #000', borderRadius: '8px', padding: '10px', backgroundColor: data.color, width: '150px', textAlign: 'center' }}>
      <Handle type="target" position="left" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5px', zIndex: 1 }} />
      <div>
        <p>{data.label}</p>
        <p>Custom Node 1</p>
      </div>
      <Handle type="source" position="right" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5px', zIndex: 1 }} />
    </div>
  );
};

const Securitygroup = ({ data }) => {
  return (
    <div style={{ border: '1px solid #000', borderRadius: '8px', padding: '10px', backgroundColor: data.color, width: '150px', textAlign: 'center' }}>
      <Handle type="target" position="left" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5x', zIndex: 1 }} />
      <div>
        <p>{data.label}</p>
        <p>Custom Node 2</p>
      </div>
      <Handle type="source" position="right" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5px', zIndex: 1 }} />
    </div>
  );
};
const rds = ({ data }) => {
  return (
    <div style={{ border: '1px solid #000', borderRadius: '8px', padding: '10px', backgroundColor: data.color, width: '150px', textAlign: 'center' }}>
      <Handle type="target" position="left" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5x', zIndex: 1 }} />
      <div>
        <p>{data.label}</p>
        <p>Custom Node 2</p>
      </div>
      <Handle type="source" position="right" style={{ background: '#555', borderRadius: '8px', width: '5px', height: '5px', zIndex: 1 }} />
    </div>
  );
};

export { rds, Securitygroup, Ec2 };
