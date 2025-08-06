#!/bin/bash

# Run prisma migrations
cd backend
npx prisma migrate dev --name init
