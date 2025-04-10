import React, { useState } from 'react';
import Modal from './Modal'; // Your modal component
import axios from 'axios';

const DescriptionGeneratorModal = ({ onClose, onAccept }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const res = await axios.post('/api/ai/generate-description', {
      title, category, keywords
    });
    setGenerated(res.data.description);
    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">AI Description Generator</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mb-2 border" />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 mb-2 border" />
      <input placeholder="Keywords (comma separated)" value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full p-2 mb-2 border" />
      
      <button onClick={handleGenerate} className="bg-green-600 text-white px-4 py-2">
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {generated && (
        <div className="mt-4">
          <h4 className="font-bold">Generated Description:</h4>
          <p className="border p-2 mt-2 bg-gray-100">{generated}</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-1" onClick={() => onAccept(generated)}>
            Accept
          </button>
        </div>
      )}
    </Modal>
  );
};

export default DescriptionGeneratorModal;
