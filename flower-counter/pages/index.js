import { useEffect, useState } from 'react';

export default function Home() {
  const [greenCount, setGreenCount] = useState('Loading...');
  const [redCount, setRedCount] = useState('Loading...');

  async function fetchCount(tokenId, setter) {
    try {
      const res = await fetch(`/api/tokenSupply?tokenId=${tokenId}`);
      const data = await res.json();
      setter(data.balance);
    } catch {
      setter('Error');
    }
  }

  useEffect(() => {
    fetchCount(1, setGreenCount);
    fetchCount(2, setRedCount);
    const interval = setInterval(() => {
      fetchCount(1, setGreenCount);
      fetchCount(2, setRedCount);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem'
    }}>
      <div>🌿 Green Flowers: {greenCount}</div>
      <div style={{ marginTop: '1rem' }}>🌹 Red Flowers: {redCount}</div>
    </div>
  );
}