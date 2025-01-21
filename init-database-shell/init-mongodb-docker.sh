docker volume create mongo-data
docker run -d -p 27017:27017 -v mongo-data:/data/db --name mongo-tutorial-nodejs-be mongo
docker exec -it mongo-tutorial-nodejs-be mongosh
