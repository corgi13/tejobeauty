#!/bin/bash

# Lint backend
cd backend
npm run lint

# Lint frontend
cd ../frontend
npm run lint
