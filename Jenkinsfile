pipeline {
    agent any

    parameters {
        string(name: 'TARGET_URL', defaultValue: 'https://www.deque.com/', description: 'The URL to check for accessibility.')
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'git', url: 'https://github.com/ferosetechie/axe-core.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Accessibility Tests') {
            steps {
                script {
                    // Run the accessibility test script and export results to a file
                    sh "node run-accessibility-tests.js ${params.TARGET_URL}"
                    
                    // Archive the results file
                    archiveArtifacts artifacts: 'accessibility-results.json', allowEmptyArchive: true
                    
                    // Read and echo results for logging purposes
                    def results = readFile('accessibility-results.json')
                    echo "Accessibility Test Results:\n${results}"

                    // generating the accessibility results to a zip
                    
		    sh "zip accessibility-results.zip accessibility-results.json"
 
                    // Archive the compressed results file
                    archiveArtifacts artifacts: 'accessibility-results.zip',allowEmptyArchive: true                   
                }
            }
        }
    }

    post {
        always {
            echo 'The pipeline has completed.'
        }
    }
}
