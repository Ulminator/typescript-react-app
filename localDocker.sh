docker build -t typescript-react-app .
docker kill app
docker rm app
docker run -it -p 8080:8080 -p 3000:3000 --name app -d typescript-react-app
# docker run -it -p 8080:8080 -p 3000:3000 -e NODE_ENV=development --name app -d typescript-react-app
docker exec -it app bash