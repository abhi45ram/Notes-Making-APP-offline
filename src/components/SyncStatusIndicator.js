import React from 'react';

export default function SyncStatusIndicator({ syncStatus, synced }) {
  if (syncStatus === 'Syncing...') {
    return <span style={{ color: 'blue' }}>Syncing...</span>;
  } else if (syncStatus === 'Error') {
    return <span style={{ color: 'red' }}> Error</span>;
  } else if (synced) {
    return <span style={{ color: 'green' }}>Synced</span>;
  } else {
    return <span style={{ color: 'orange' }}>Unsynced</span>;
  }
}