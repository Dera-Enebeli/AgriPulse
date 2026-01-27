# AgriPulse Production Deployment Guide

## Overview
This guide covers deploying AgriPulse to production environments.

## Prerequisites
- Node.js 18+ LTS
- MongoDB 6.0+
- Nginx (for reverse proxy)
- SSL certificate
- Production server (Linux recommended)

## Environment Setup

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Application Setup
```bash
# Clone repository
git clone <your-repo-url> /var/www/agripulse
cd /var/www/agripulse

# Install dependencies
npm install --production
cd backend && npm install --production

# Configure environment variables
cp backend/.env.example backend/.env
nano backend/.env
```

### 3. Environment Configuration
Edit `backend/.env`:
```env
NODE_ENV=production
PORT=5002
FRONTEND_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb://localhost:27017/agripulse_prod

# JWT (use strong secrets)
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Paystack Production Keys
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key

# Email Configuration
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your_secure_email_password
```

### 4. Build Frontend
```bash
cd /var/www/agripulse
npm run build
```

### 5. Nginx Configuration
Create `/etc/nginx/sites-available/agripulse`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend static files
    location / {
        root /var/www/agripulse/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/agripulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Set up auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Process Management with PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'agripulse-backend',
    cwd: '/var/www/agripulse/backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5002
    },
    error_file: '/var/log/agripulse/error.log',
    out_file: '/var/log/agripulse/out.log',
    log_file: '/var/log/agripulse/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
sudo mkdir -p /var/log/agripulse
sudo chown $USER:$USER /var/log/agripulse

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. Database Security
```bash
# Enable MongoDB authentication
sudo nano /etc/mongod.conf

# Add security section:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Update connection string in .env:
MONGODB_URI=mongodb://admin:secure_password@localhost:27017/agripulse_prod?authSource=admin
```

### 9. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 10. Monitoring and Backup
```bash
# Set up log rotation
sudo nano /etc/logrotate.d/agripulse
```
```
/var/log/agripulse/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

```bash
# Database backup script
cat > /home/user/backup-mongodb.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/mongodb-backups"
mkdir -p \$BACKUP_DIR

mongodump --uri="mongodb://admin:password@localhost:27017/agripulse_prod?authSource=admin" --out="\$BACKUP_DIR/\$DATE"

# Keep only last 7 days
find \$BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x /home/user/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-mongodb.sh
```

## Health Checks
Create health check endpoints:
```bash
# Test application health
curl https://yourdomain.com/api/health
curl https://yourdomain.com
```

## Performance Optimization
1. Enable Gzip compression in Nginx
2. Set up Redis for session storage
3. Configure MongoDB indexes
4. Enable CDN for static assets
5. Monitor with PM2 monitoring

## Scaling Considerations
1. Load balancer for multiple app instances
2. MongoDB replica set
3. Redis cluster for sessions
4. Separate database server
5. Microservices architecture for larger scale

## Security Checklist
- [ ] SSL/TLS configured
- [ ] Firewall enabled
- [ ] MongoDB authentication
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] Log monitoring
- [ ] Backup procedures
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation enabled

## Troubleshooting
```bash
# Check PM2 status
pm2 status
pm2 logs

# Check Nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check MongoDB
sudo systemctl status mongod
sudo tail -f /var/log/mongodb/mongod.log

# Restart services
pm2 restart all
sudo systemctl reload nginx
sudo systemctl restart mongod
```

## Support
For production deployment support:
- Email: agripulse720@gmail.com
- Documentation: Check README.md
- Issues: Create GitHub issue