#!/bin/bash
# GitHub Copilot: Create a script to install and configure Elasticsearch:
# 1. Install Elasticsearch
# 2. Configure memory settings
# 3. Set up security
# 4. Create system service
# 5. Initialize product indices

# 1. Install Elasticsearch
# Add Elasticsearch repository
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list

# Install Elasticsearch
sudo apt-get update && sudo apt-get install elasticsearch

# 2. Configure memory settings
# Set heap size to 50% of available RAM, up to a max of 32GB
sudo sed -i 's/-Xms1g/-Xms4g/g' /etc/elasticsearch/jvm.options
sudo sed -i 's/-Xmx1g/-Xmx4g/g' /etc/elasticsearch/jvm.options

# 3. Set up security
# Enable security features
echo "xpack.security.enabled: true" | sudo tee -a /etc/elasticsearch/elasticsearch.yml
echo "xpack.security.transport.ssl.enabled: true" | sudo tee -a /etc/elasticsearch/elasticsearch.yml

# 4. Create system service
# Start and enable Elasticsearch service
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch.service
sudo systemctl start elasticsearch.service

# 5. Initialize product indices
# Wait for Elasticsearch to start
sleep 30

# Create product index
curl -X PUT "http://localhost:9200/products" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "description": { "type": "text" },
      "category": { "type": "keyword" },
      "price": { "type": "float" }
    }
  }
}
'
