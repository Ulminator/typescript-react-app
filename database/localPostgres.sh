echo "--CREATING DOCKERIZED POSTGRES INSTANCE--"
docker kill pg
docker rm -f pg
docker run -p 5432:5432 --name pg -d postgres:9.6

echo "--COPYING SQL FILES--"
docker cp ../database/ddl/createTables.sql pg:/createTables.sql
docker cp ../database/dml/insertData.sql pg:/insertData.sql
sleep 3

echo "--CREATING AND POPULATING TABLES--"
docker exec -d pg psql -U postgres -w -f createTables.sql
docker exec -d pg psql -U postgres -w -f insertData.sql