# Docker Deployment Guide for TreadX CRM

This guide explains how to deploy the TreadX CRM application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Production Deployment

1. **Build and run the production container:**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d treadx-crm-prod
   
   # Or using Docker directly
   docker build -t treadx-crm .
   docker run -d -p 3000:80 --name treadx-crm treadx-crm
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000` or `http://your-server-ip:3000`

### Development Deployment

1. **Build and run the development container:**
   ```bash
   # Using Docker Compose
   docker-compose --profile dev up -d treadx-crm-dev
   
   # Or using Docker directly
   docker build -f Dockerfile.dev -t treadx-crm-dev .
   docker run -d -p 5173:5173 -v $(pwd):/app treadx-crm-dev
   ```

2. **Access the development server:**
   - Open your browser and navigate to `http://localhost:5173`

## Docker Commands

### Build Images

```bash
# Build production image
docker build -t treadx-crm .

# Build development image
docker build -f Dockerfile.dev -t treadx-crm-dev .
```

### Run Containers

```bash
# Run production container
docker run -d -p 3000:80 --name treadx-crm-prod treadx-crm

# Run development container with volume mounting
docker run -d -p 5173:5173 -v $(pwd):/app --name treadx-crm-dev treadx-crm-dev
```

### Manage Containers

```bash
# Stop containers
docker stop treadx-crm-prod
docker stop treadx-crm-dev

# Remove containers
docker rm treadx-crm-prod
docker rm treadx-crm-dev

# View logs
docker logs treadx-crm-prod
docker logs treadx-crm-dev

# Execute commands in running container
docker exec -it treadx-crm-prod sh
```

## Docker Compose Commands

```bash
# Start production environment
docker-compose up -d

# Start development environment
docker-compose --profile dev up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up -d --build
```

## Server Deployment

### 1. Copy Files to Server

Upload the following files to your server:
- `Dockerfile`
- `Dockerfile.dev`
- `docker-compose.yml`
- `nginx.conf`
- `.dockerignore`
- All source code files

### 2. Build and Deploy

```bash
# SSH into your server
ssh user@your-server-ip

# Navigate to project directory
cd /path/to/treadx-crm

# Build and start production container
docker-compose up -d treadx-crm-prod
```

### 3. Configure Reverse Proxy (Optional)

If you're using a reverse proxy like Nginx or Apache:

```nginx
# Nginx configuration example
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. SSL/HTTPS Setup (Recommended)

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Environment Variables

Create a `.env` file for environment-specific configurations:

```bash
# .env
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=TreadX CRM
```

## Health Checks

The application includes a health check endpoint:
- URL: `http://your-domain.com:3000/health`
- Returns: `healthy` with status 200

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port (Windows PowerShell)
   .\check-ports.ps1
   
   # Or manually check
   netstat -ano | findstr :3000
   netstat -ano | findstr :80
   
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Permission issues:**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   # Log out and log back in
   ```

3. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Container won't start:**
   ```bash
   # Check logs
   docker logs container-name
   
   # Check container status
   docker ps -a
   ```

### Port Configuration

If you need to use different ports, modify the `docker-compose.yml` file:

```yaml
# For production (change 3000 to your preferred port)
ports:
  - "8080:80"  # Maps host port 8080 to container port 80

# For development (change 5173 to your preferred port)
ports:
  - "3001:5173"  # Maps host port 3001 to container port 5173
```

### Performance Optimization

1. **Enable Docker BuildKit:**
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Use multi-stage builds** (already implemented in Dockerfile)

3. **Optimize nginx configuration** for your specific use case

## Monitoring

### Basic Monitoring Commands

```bash
# Check container resource usage
docker stats

# Monitor logs in real-time
docker-compose logs -f

# Check disk usage
docker system df
```

### Production Monitoring

Consider using monitoring tools like:
- Prometheus + Grafana
- Docker Swarm or Kubernetes for orchestration
- ELK Stack for log management

## Security Considerations

1. **Keep Docker updated**
2. **Use specific image tags** (not `latest`)
3. **Scan images for vulnerabilities**
4. **Implement proper firewall rules**
5. **Use secrets management** for sensitive data
6. **Regular security updates**

## Backup and Recovery

### Backup Strategy

```bash
# Backup application data
docker run --rm -v treadx-crm_data:/data -v $(pwd):/backup alpine tar czf /backup/app-backup.tar.gz /data

# Backup configuration
cp docker-compose.yml backup/
cp nginx.conf backup/
```

### Recovery

```bash
# Restore from backup
docker run --rm -v treadx-crm_data:/data -v $(pwd):/backup alpine tar xzf /backup/app-backup.tar.gz -C /
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker and nginx logs
3. Ensure all prerequisites are met
4. Verify network connectivity and firewall settings 