CONTAINER_NAME=mongo-tutorial-nodejs-be

docker exec -it $CONTAINER_NAME mongosh

# mongosh show collections
# DB_NAME=example_db_dev
# use $DB_NAME
# show collections


# find all documents in a collection
# COLLECTION_NAMES=(users, authTokeyKeys)
# db.$COLLECTION_NAME.find()

# using mongo compact
# URI: mongodb://localhost:27017
