import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapView from './components/MapView';
import CameraFeed from './components/CameraFeed';
import AdminPanel from './components/AdminPanel';

function App() {
  const [selectedCamera, setSelectedCamera] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
          <div className="text-xl font-bold">CCTV Feed App</div>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/admin" className="hover:underline">Admin Panel</Link>
          </div>
        </nav>
        <main className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MapView onSelectCamera={setSelectedCamera} />
                  {selectedCamera && <CameraFeed camera={selectedCamera} />}
                </>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
