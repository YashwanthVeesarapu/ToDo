pipeline {
    agent any

    // Angular project pipeline

    environment {
        // firebase json file
        GOOGLE_APPLICATION_CREDENTIALS = credentials('FIREBASE_TOKEN')
    }

    stages {
        // Checkout the code from the repository
        stage('Checkout Code') {
            steps {
                echo 'Checking out the code from the repository'
                git branch: 'main', 
                    credentialsId: 'eff5d436-cb19-40a4-aa3c-e7df06f08652', 
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

        // Install Firebase CLI
        stage('Install Firebase CLI') {
            steps {
                echo 'Installing Firebase CLI'
                sh 'sudo npm install -g firebase-tools'
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
