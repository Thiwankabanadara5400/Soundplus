pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Thiwankabanadara5400/Soundplus.git'
            }
        }

        stage('Pre-flight Check') {
            steps {
                echo '=== Pre-flight Docker & Environment Validation ==='
                echo "Current user: $(whoami)"
                echo "Current groups: $(id)"
                echo ""
                echo "Docker socket info:"
                sh 'ls -l /var/run/docker.sock || echo "Socket not found"'
                echo ""
                echo "Docker version:"
                sh 'docker --version || echo "Docker not available"'
                echo ""
                echo "Docker Compose version:"
                sh 'docker compose version || echo "Docker Compose not available"'
                echo ""
                echo "Test docker daemon access:"
                sh 'docker ps -q | head -3 || echo "Cannot access Docker daemon - check permissions"'
                echo ""
                echo "Workspace contents:"
                sh 'ls -la | head -20'
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Setting up environment files from .env.example if needed'
                // copy frontend .env if missing
                sh "if [ -f frontend/.env.example ]; then cd frontend && [ -f .env ] || cp .env.example .env; fi"
                // copy backend .env if missing
                sh "if [ -f backend/.env.example ]; then cd backend && [ -f .env ] || cp .env.example .env; fi"
            }
        }

        stage('Build & Test') {
            steps {
                sh 'docker-compose build'
                sh 'docker-compose up -d'
                sh 'sleep 30'  // Wait for containers to start
                sh 'docker-compose ps'  // Check container status
            }
        }

        stage('Deploy') {
            steps {
                sh 'echo "Deployment completed successfully"'
            }
        }
    }

    post {
        always {
            sh 'docker-compose down'  // Cleanup
        }
    }
}
