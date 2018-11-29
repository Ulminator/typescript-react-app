# SERVICE="$(node -e "console.log(require('./package.json').name);")"
# VERSION="$(node -e "console.log(require('./package.json').version);")"
SERVICE="typescript-react-app"
VERSION="1.0.2"

PROJECT=$1

if [ -z "$PROJECT" ]; then 
    echo "$(tput setaf 7)$(tput setab 1)$(tput bold) ERROR: Please provide a project for deployment $(tput sgr 0)"
    exit 1 
fi

echo "$(tput setaf 033)$(tput setab 249)$(tput bold) --Building Image for App Version $(tput setaf 124)${VERSION}-- $(tput sgr 0)"
docker build -t ${SERVICE} .
docker tag ${SERVICE} us.gcr.io/${PROJECT}/${SERVICE}:$VERSION
docker tag ${SERVICE} us.gcr.io/${PROJECT}/${SERVICE}:latest

echo "$(tput setaf 033)$(tput setab 249)$(tput bold) --Pushing Image to Google Container Registry-- $(tput sgr 0)"
docker push us.gcr.io/${PROJECT}/${SERVICE}:$VERSION
docker push us.gcr.io/${PROJECT}/${SERVICE}:latest
docker logout us.gcr.io

echo "$(tput setaf 033)$(tput setab 249)$(tput bold) --Deploying to App Engine-- $(tput sgr 0)"
gcloud -q app deploy app.yaml --project=${PROJECT} --image-url=us.gcr.io/${PROJECT}/${SERVICE}:$VERSION