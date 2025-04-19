const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// In-memory camera storage
let cameras = [
  {
    id: 1,
    name: 'Camera 1',
    latitude: 40.712776,
    longitude: -74.005974,
    feedUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    id: 2,
    name: 'Camera 2',
    latitude: 34.052235,
    longitude: -118.243683,
    feedUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  }
];

// Get all cameras
app.get('/api/cameras', (req, res) => {
  res.json(cameras);
});

// Add a new camera
app.post('/api/cameras', (req, res) => {
  const { name, latitude, longitude, feedUrl } = req.body;
  if (!name || !latitude || !longitude || !feedUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newCamera = {
    id: cameras.length ? cameras[cameras.length - 1].id + 1 : 1,
    name,
    latitude,
    longitude,
    feedUrl
  };
  cameras.push(newCamera);
  res.status(201).json(newCamera);
});

// Update a camera
app.put('/api/cameras/:id', (req, res) => {
  const cameraId = parseInt(req.params.id);
  const cameraIndex = cameras.findIndex(c => c.id === cameraId);
  if (cameraIndex === -1) {
    return res.status(404).json({ error: 'Camera not found' });
  }
  const { name, latitude, longitude, feedUrl } = req.body;
  if (!name || !latitude || !longitude || !feedUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  cameras[cameraIndex] = { id: cameraId, name, latitude, longitude, feedUrl };
  res.json(cameras[cameraIndex]);
});

// Delete a camera
app.delete('/api/cameras/:id', (req, res) => {
  const cameraId = parseInt(req.params.id);
  const cameraIndex = cameras.findIndex(c => c.id === cameraId);
  if (cameraIndex === -1) {
    return res.status(404).json({ error: 'Camera not found' });
  }
  cameras.splice(cameraIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`CCTV feed backend listening at http://localhost:${port}`);
});
