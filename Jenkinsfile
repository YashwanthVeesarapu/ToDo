pipeline {
    agent {
        docker {
            image 'node:18-alpine'        
        }
    }

    // Angular project pipeline
    environment {
        // firebase json file
        GOOGLE_APPLICATION_CREDENTIALS = credentials('MAIN_FIREBASE_KEY')
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
                sh 'npm install firebase-tools'
            }
        }
        
        // Deploy to Firebase
        stage('Deploy') {
            steps {
                echo 'Deploying the Angular project to Firebase'
                sh 'npx firebase deploy --only hosting'
            }
        }
    }
}
