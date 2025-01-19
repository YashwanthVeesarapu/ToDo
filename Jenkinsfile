pipeline{
    agent any;
    // Angular project
    stages{
        // Checkout the code from the repository 
        stage('Checkout Code') {
            steps {
                // Clone the Git repository
                git branch: 'main', 
                    credentialsId: 'bfc88f96-eb1e-4df4-99cb-66f945cc956a', 
                    url: 'https://github.com/YashwanthVeesarapu/ToDo-Server.git' 
            }
        }

        stage('Install Dependencies'){
            steps{
                echo 'Building the project';
                sh 'npm install';  
            }
        }

        stage('Build'){
            steps{
                echo 'Testing the project';
                sh 'ng build';
            }
        }
        // Populate the firebase token
        stage('Firebase login'){
            steps{
                echo 'Login to firebase';
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]){
                    // Save the token in the environment variable GOOGLE_APPLICATION_CREDENTIALS
                    sh 'echo $FIREBASE_TOKEN > $GOOGLE_APPLICATION_CREDENTIALS'; 
                }
            }
        }
        stage('Deploy'){
            steps{
                echo 'Deploying the project';
                sh 'firebase deploy --only hosting';
            }
        }
    }
}