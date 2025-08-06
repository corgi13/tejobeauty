#!/bin/bash

# Start backend in dev mode
cd backend
npm run start:dev &

# Start frontend in dev mode
cd ../frontend
npm run dev
