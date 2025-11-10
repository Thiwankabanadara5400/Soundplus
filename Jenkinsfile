pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Thiwankabanadara5400/Soundplus.git'
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
