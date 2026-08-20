import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPhysicians, setLikedPhysicians] = useState(new Set());

  useEffect(() => {
    console.log('[Frontend] Starting to fetch physicians...');
    setLoading(true);

    fetch('http://localhost:3000/api/physicians')
      .then(res => {
        console.log('[Frontend] Response received, status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('[Frontend] Data parsed:', data);
        console.log('[Frontend] Number of physicians:', data.data?.length || 0);
        setPhysicians(data.data || []);
        setError(null);
      })
      .catch(error => {
        console.error('[Frontend] Error fetching physicians:', error.message);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
        console.log('[Frontend] Fetch completed');
      });
  }, []);

  const handleLike = async (id, isLiked) => {
    const endpoint = isLiked ? 'unlike' : 'like';
    console.log(`[Frontend] Attempting to ${endpoint} physician ID: ${id}`);

    try {
      const response = await fetch(`http://localhost:3000/api/physicians/${id}/${endpoint}`, {
        method: 'POST'
      });

      console.log(`[Frontend] ${endpoint} response status:`, response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      console.log(`[Frontend] ${endpoint} successful. New physician data:`, data.data);

      // Update physicians list with new data
      setPhysicians(physicians.map(p => p.id === id ? data.data : p));

      // Update liked set
      if (isLiked) {
        const newLiked = new Set(likedPhysicians);
        newLiked.delete(id);
        setLikedPhysicians(newLiked);
      } else {
        setLikedPhysicians(new Set([...likedPhysicians, id]));
      }
    } catch (err) {
      console.error(`[Frontend] Error ${endpoint}ing physician:`, err.message);
      alert(`Failed to ${endpoint} physician`);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading physicians...</p></div>;
  }

  if (error) {
    return <div className="container"><p className="error">Error: {error}</p></div>;
  }

  return (
    <div className="container">
      <h1>Physicians Directory</h1>
      <div className="physicians-grid">
        {physicians.map(physician => (
          <div key={physician.id} className="physician-card">
            <div className="card-header">
              <h2>{physician.name}</h2>
              <span className="likes-badge">{physician.likes_count} ❤️</span>
            </div>

            <div className="card-body">
              <p><strong>Specialty:</strong> {physician.specialty}</p>
              <p><strong>Email:</strong> <a href={`mailto:${physician.email}`}>{physician.email}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${physician.phone}`}>{physician.phone}</a></p>
            </div>

            <div className="card-footer">
              <button
                className={`like-button ${likedPhysicians.has(physician.id) ? 'liked' : ''}`}
                onClick={() => handleLike(physician.id, likedPhysicians.has(physician.id))}
              >
                {likedPhysicians.has(physician.id) ? '❤️ Unlike' : '🤍 Like'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
