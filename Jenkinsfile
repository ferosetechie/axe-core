pipeline {
    agent any

    parameters {
        string(name: 'TARGET_URL', defaultValue: 'https://www.deque.com/', description: 'The URL to check for accessibility.')
    }

    environment {
        CHROME_BIN = "/usr/bin/google-chrome" // Ensure Chrome is installed
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'git', url: 'https://github.com/ferosetechie/axe-core.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Functional & Accessibility Tests') {
            steps {
                script {
                    sh "node run-accessibility-tests.js ${params.TARGET_URL}"

                    // Archive Accessibility Results
                    archiveArtifacts artifacts: 'accessibility-results.json', allowEmptyArchive: true

                    // Compress results
                    sh "zip accessibility-results.zip accessibility-results.json"
                    archiveArtifacts artifacts: 'accessibility-results.zip', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            echo '✅ The pipeline has completed.'
        }
    }
}
