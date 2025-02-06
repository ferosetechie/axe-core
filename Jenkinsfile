pipeline {
    agent any

    parameters {
        string(name: 'TARGET_URL', defaultValue: 'https://www.deque.com/', description: 'The URL to check for accessibility.')
    }

    environment {
        CHROME_BIN = "/usr/bin/google-chrome"
        PATH = "/usr/local/bin:/usr/bin:/bin"
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
                    try {
                        sh "node run-accessibility-tests.js ${params.TARGET_URL} --headless"

                        // Archive Accessibility Results
                        archiveArtifacts artifacts: 'accessibility-results.json', allowEmptyArchive: true

                        // Compress results
                        sh "zip -r accessibility-results.zip accessibility-results.json"
                        archiveArtifacts artifacts: 'accessibility-results.zip', allowEmptyArchive: true
                    } catch (Exception e) {
                        echo "❌ Tests failed: ${e}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to test failure.")
                    }
                }
            }
        }
    }

    post {
        always {
            echo '✅ The pipeline has completed.'
        }
        failure {
            echo '❌ The pipeline failed. Check logs for details.'
        }
    }
}
