#!/bin/bash

# Tejo Nails Platform - Kubernetes Deployment Script

set -e

echo "🚀 Starting Tejo Nails Platform Kubernetes deployment..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

# Build Docker images
echo "🏗️  Building Docker images..."
docker build -t tejo-nails-backend:latest -f backend/Dockerfile backend/
docker build -t tejo-nails-frontend:latest -f frontend/Dockerfile frontend/

# Tag images for registry (adjust registry URL as needed)
# docker tag tejo-nails-backend:latest your-registry/tejo-nails-backend:latest
# docker tag tejo-nails-frontend:latest your-registry/tejo-nails-frontend:latest

# Push images to registry (uncomment when using external registry)
# docker push your-registry/tejo-nails-backend:latest
# docker push your-registry/tejo-nails-frontend:latest

# Apply Kubernetes manifests
echo "📦 Applying Kubernetes manifests..."

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy PostgreSQL
echo "🗄️  Deploying PostgreSQL..."
kubectl apply -f k8s/postgres.yaml

# Deploy Redis
echo "🔴 Deploying Redis..."
kubectl apply -f k8s/redis.yaml

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n tejo-nails --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n tejo-nails --timeout=300s

# Deploy backend
echo "🔧 Deploying backend..."
kubectl apply -f k8s/backend.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n tejo-nails --timeout=300s

# Run database migrations
echo "🗄️  Running database migrations..."
BACKEND_POD=$(kubectl get pods -n tejo-nails -l app=backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n tejo-nails $BACKEND_POD -- npx prisma migrate deploy
kubectl exec -n tejo-nails $BACKEND_POD -- npx prisma generate

# Deploy frontend
echo "🎨 Deploying frontend..."
kubectl apply -f k8s/frontend.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend -n tejo-nails --timeout=300s

# Create Ingress (optional - adjust based on your ingress controller)
cat > k8s/ingress.yaml << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tejo-nails-ingress
  namespace: tejo-nails
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - 138.199.226.201
    secretName: tejo-nails-tls
  rules:
  - host: 138.199.226.201
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3001
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 3000
EOF

kubectl apply -f k8s/ingress.yaml

# Display deployment status
echo ""
echo "🎉 Kubernetes deployment completed!"
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n tejo-nails
echo ""
echo "🌐 Services:"
kubectl get services -n tejo-nails
echo ""
echo "📝 To view logs: kubectl logs -f deployment/[deployment-name] -n tejo-nails"
echo "🔍 To check status: kubectl get all -n tejo-nails"
echo "🛑 To delete: kubectl delete namespace tejo-nails"
echo ""