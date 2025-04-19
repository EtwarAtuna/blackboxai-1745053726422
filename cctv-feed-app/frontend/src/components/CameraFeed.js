import React from 'react';

function CameraFeed({ camera }) {
  if (!camera) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{camera.name} - Live Feed</h2>
      <video
        src={camera.feedUrl}
        controls
        autoPlay
        muted
        className="w-full rounded-md border border-gray-300"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default CameraFeed;
