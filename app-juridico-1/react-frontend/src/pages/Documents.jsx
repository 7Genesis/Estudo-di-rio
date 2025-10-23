import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/api/documents');
        setDocuments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.type} - {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documents;