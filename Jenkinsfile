pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-credentials'
        GIT_REPO_URL = 'https://github.com/spinsoft-aat/frontend_one_stop_service_ng.git'
        IMAGE_NAME = 'thspinsoft/aat-one-stop-service-ng'
        EMAIL_BY = 'rujrada.t@spinsoft.co.th'
        SKIP_BUILD_AND_PUSH = sh(returnStdout: true, script: 'cat .env | grep SKIP_BUILD_AND_PUSH | cut -d "=" -f2').trim()
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    GIT_REPO_BRANCH = sh(returnStdout: true, script: 'cat .env | grep GIT_REPO_BRANCH | cut -d "=" -f2').trim()
                    TAG_BASE = sh(returnStdout: true, script: 'cat .env | grep TAG | cut -d "=" -f2').trim()
                    TAG = (GIT_REPO_BRANCH == 'demo') ? "${TAG_BASE}-demo" : TAG_BASE
                    EDITFILE_FILE = (GIT_REPO_BRANCH == 'demo') ? 'demo/web-deploy.yaml' : 'deploy/web-deploy.yaml'
                }
            }
        }
        
        stage('Build') {
            when {
                expression { env.SKIP_BUILD_AND_PUSH != "true" }
            }
            steps {
                script {
                    docker.build(IMAGE_NAME + ":" + TAG, ".")
                }
            }
        }

        stage('Push') {
            when {
                expression { env.SKIP_BUILD_AND_PUSH != "true" }
            }
            steps {
                script {
                    echo "Pushing ${IMAGE_NAME}:${TAG}..."
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                        docker.image(IMAGE_NAME + ":" + TAG).push()
                    }
                    echo "Push...OK"
                }
            }
        }

        stage('UpdateTag and Push') {
           steps {
                withCredentials([usernamePassword(credentialsId: 'github-spinsoft-aat', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    // กำหนดอีเมล์สำหรับใช้ git commit
                    sh "git config --global user.email ${EMAIL_BY}"                   
                    // fetch ข้อมูลจาก remote repository
                    sh "git fetch https://\${USERNAME}:\${PASSWORD}@${GIT_REPO_URL}"            
                    // รีเซ็ต branch ให้ตรงกับ remote repository master
                    sh "git reset --hard origin/master" 
                    // สลับไปที่ branch ตามค่า GIT_REPO_BRANCH
                    sh "git checkout origin/${GIT_REPO_BRANCH}" 
                    sh "git reset --hard origin/${GIT_REPO_BRANCH}"
                    // fetch ข้อมูลจาก remote repository
                    sh "git fetch https://\${USERNAME}:\${PASSWORD}@${GIT_REPO_URL} ${GIT_REPO_BRANCH}"
                    // pull ข้อมูลจาก remote repository
                    sh "git pull https://\${USERNAME}:\${PASSWORD}@${GIT_REPO_URL} ${GIT_REPO_BRANCH}"
                    // merge ข้อมูลจาก branch origin/GIT_REPO_BRANCH กับ branch GIT_REPO_BRANCH ใน local repository
                    sh "git merge origin/${GIT_REPO_BRANCH}"               
                    // merge ข้อมูลจาก branch origin/master กับ branch GIT_REPO_BRANCH ใน local repository
                    sh "git merge origin/master"
                    // อัพเดทไฟล์ที่ต้องการแก้ไข
                    sh """#!/bin/bash
                        echo "Update yaml with new image tag"
                        ls -lth
                        sed -i 's|image:.*|image: ${IMAGE_NAME}:${TAG}|' ${EDITFILE_FILE}
                        pwd
                        git add .
                        git commit -m 'Triggered Build Tag : ${TAG}'
                        git push https://\${USERNAME}:\${PASSWORD}@${GIT_REPO_URL} HEAD:${GIT_REPO_BRANCH}
                        """
                }
            }
        }

        stage('Done') {
            steps {
                echo "Done."
            }
        }
    }
}
