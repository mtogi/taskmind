#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Start the frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  kill $SERVER_PID
  kill $FRONTEND_PID
  exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Development servers are running. Press Ctrl+C to stop."
wait 