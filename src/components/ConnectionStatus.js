import React from 'react';

export default function ConnectionStatus({ online }) {
  return (
    <div
      style={{
        padding: '5px 10px',
        color: online ? 'green' : 'red',
        fontWeight: 'bold',
      }}
    >
      {online ? 'Online' : 'Offline'}
    </div>
  );
}
