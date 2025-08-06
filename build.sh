#!/bin/bash

# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
