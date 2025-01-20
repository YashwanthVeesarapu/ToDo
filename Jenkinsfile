pipeline {
    agent any

    // Angular project pipeline
    stages {
        // Checkout the code from the repository
        stage('Checkout Code') {
            steps {
                echo 'Checking out the code from the repository'
                git branch: 'main', 
                    credentialsId: 'bfc88f96-eb1e-4df4-99cb-66f945cc956a', 
                    url: 'https://github.com/YashwanthVeesarapu/ToDo.git'
            }
        }

        // Install project dependencies
        stage('Install Dependencies') {
            steps{
            script {
                echo 'Installing project dependencies'
                sh 'npm install'
            }
            }
        }
        // Build the Angular project
        stage('Build') {
            steps {
                script{
                echo 'Building the Angular project'
                sh 'npm run build'
                }
            }
        }

        // Firebase authentication and token configuration
        stage('Firebase Login') {
            steps {
                echo 'Logging into Firebase'
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    // Save the token in the environment variable
                    sh 'echo $FIREBASE_TOKEN > $GOOGLE_APPLICATION_CREDENTIALS'
                }
            }
        }

        // Deploy to Firebase
        stage('Deploy') {
            steps {
                echo 'Deploying the Angular project to Firebase'
                sh 'firebase deploy --only hosting'
            }
        }
    }

    // Optional post section for notifications or cleanup
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
