#!/bin/bash

# Load NVM if it exists
export NVM_DIR="$HOME/.nvm"

# Start Flask backend in a new terminal
gnome-terminal -- bash -c "
    source venv/bin/activate &&
    cd server &&
    python server.py;
    exec bash
"

# Start React frontend in another new terminal
gnome-terminal -- bash -c "
    cd client &&
    [ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\" &&  # Source nvm script
    nvm use 20 &&  # Use the correct Node.js version
    nvm use 20 &&
    npm start;
    exec bash
"

echo "Both Flask and React apps are running in separate terminals."

