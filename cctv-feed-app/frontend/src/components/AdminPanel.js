import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [cameras, setCameras] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    latitude: '',
    longitude: '',
    feedUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCameras = () => {
    fetch('http://localhost:5000/api/cameras')
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch((err) => setError('Failed to fetch cameras'));
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const { id, name, latitude, longitude, feedUrl } = form;
    if (!name || !latitude || !longitude || !feedUrl) {
      setError('All fields are required');
      return;
    }

    const payload = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      feedUrl,
    };

    if (isEditing) {
      fetch(`http://localhost:5000/api/cameras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to update camera');
          return res.json();
        })
        .then(() => {
          fetchCameras();
          resetForm();
        })
        .catch(() => setError('Failed to update camera'));
    } else {
      fetch('http://localhost:5000/api/cameras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to add camera');
          return res.json();
        })
        .then(() => {
          fetchCameras();
          resetForm();
        })
        .catch(() => setError('Failed to add camera'));
    }
  };

  const handleEdit = (camera) => {
    setForm({
      id: camera.id,
      name: camera.name,
      latitude: camera.latitude,
      longitude: camera.longitude,
      feedUrl: camera.feedUrl,
    });
    setIsEditing(true);
    setError(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this camera?')) return;
    fetch(`http://localhost:5000/api/cameras/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status !== 204) throw new Error('Failed to delete camera');
        fetchCameras();
      })
      .catch(() => setError('Failed to delete camera'));
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      latitude: '',
      longitude: '',
      feedUrl: '',
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel - Manage Cameras</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="name">Camera Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="latitude">Latitude</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="longitude">Longitude</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="feedUrl">Feed URL</label>
          <input
            type="url"
            id="feedUrl"
            name="feedUrl"
            value={form.feedUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? 'Update Camera' : 'Add Camera'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Cameras</h3>
        {cameras.length === 0 ? (
          <p>No cameras found.</p>
        ) : (
          <ul className="space-y-2">
            {cameras.map((camera) => (
              <li
                key={camera.id}
                className="flex justify-between items-center border border-gray-300 rounded px-4 py-2"
              >
                <div>
                  <div className="font-semibold">{camera.name}</div>
                  <div className="text-sm text-gray-600">
                    Lat: {camera.latitude}, Lon: {camera.longitude}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(camera)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(camera.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
