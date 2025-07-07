#!/bin/bash

# Vultr deployment script

# Check if VULTR_API_KEY is set
if [ -z "$VULTR_API_KEY" ]; then
    echo "Error: VULTR_API_KEY environment variable is not set"
    exit 1
fi

# Configuration
INSTANCE_PLAN="vc2-1c-1gb"  # 1 CPU, 1GB RAM
REGION="ewr"               # New Jersey
OS_ID="387"                # Ubuntu 20.04 x64
LABEL="anna-webinar-demo"

# Create instance
echo "Creating Vultr instance..."
INSTANCE_ID=$(curl -s -H "Authorization: Bearer ${VULTR_API_KEY}" \
    -H "Content-Type: application/json" \
    -X POST "https://api.vultr.com/v2/instances" \
    -d '{"region":"'$REGION'","plan":"'$INSTANCE_PLAN'","os_id":'$OS_ID',"label":"'$LABEL'"}' \
    | jq -r '.instance.id')

if [ -z "$INSTANCE_ID" ]; then
    echo "Error: Failed to create instance"
    exit 1
fi

echo "Instance created with ID: $INSTANCE_ID"

# Wait for instance to be ready
echo "Waiting for instance to be ready..."
while true; do
    STATUS=$(curl -s -H "Authorization: Bearer ${VULTR_API_KEY}" \
        "https://api.vultr.com/v2/instances/$INSTANCE_ID" \
        | jq -r '.instance.status')
    
    if [ "$STATUS" = "active" ]; then
        break
    fi
    sleep 10
done

# Get instance IP
IP_ADDRESS=$(curl -s -H "Authorization: Bearer ${VULTR_API_KEY}" \
    "https://api.vultr.com/v2/instances/$INSTANCE_ID" \
    | jq -r '.instance.main_ip')

echo "Instance is ready with IP: $IP_ADDRESS"

# Deploy application
echo "Deploying application..."

# Install Node.js and nginx
ssh root@$IP_ADDRESS 'apt-get update && apt-get install -y nodejs npm nginx'

# Copy build files
scp -r build/* root@$IP_ADDRESS:/var/www/html/

# Configure nginx
ssh root@$IP_ADDRESS 'cat > /etc/nginx/sites-available/default << EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html;
    server_name _;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOL'

# Restart nginx
ssh root@$IP_ADDRESS 'systemctl restart nginx'

echo "Deployment complete!"
echo "Your application is now available at: http://$IP_ADDRESS"