## Packages
leaflet | Interactive maps
react-leaflet | React components for Leaflet maps
socket.io-client | Real-time WebSocket communication for alerts
recharts | Data visualization for sensor history charts
framer-motion | Smooth animations for alerts and transitions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
- Dashboard polls /api/sensor/latest every 10s
- Map requires Leaflet CSS to be imported in index.css
- Socket.io connects to the same host as the frontend
- Risk levels: HIGH (Red), MODERATE (Yellow), SAFE (Green)
