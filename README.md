# sermonindex-api

An api for the SermonIndex content

## Installation

```bash
# Install node packages
npm install

# Generate ts types from prisma schema for api (one time unless schema changes)
npx prisma generate
```

## Setting up the Database

Once you've downloaded and extracted the database dump:

```bash
# Start the postgresql container (use --force-recreate to start from scratch)
docker-compose up

# Seed the data
docker exec -i sermonindex-api-pgsql-1 psql --echo-errors -U root -d sermonindex_local < ./sermonindex.sql
```

**Note:**: If you've setup the db before with the previous methods, you'll need to destroy the postgres container: `docker rm sermonindex-api-pgsql-1`

## Dumping the Database

Any changes to the schema or db content will need to be dumped:

```bash
docker run --rm -it \
    --network host \
    -v ./:/backup \
    postgres:16 \
    pg_dump -U root -h localhost -b -v -f /backup/sermonindex.sql sermonindex_local
```

## Transfering Bible Data

Transfering data from the HelloAOLabs sqlite file to sermonindex db:

```sh
# One time (unless the sqlite file changes)
sqlite3 bible.eng.db
DROP TABLE \_prisma_migrations;
.quit

pgloader --with "quote identifiers" sqlite://bible.eng.db pgsql://root:root@localhost/sermonindex_local
```

## Running the app

Ensure the postgresql db is up (via `docker-compose up`) and the db schema is defined (via `npx prisma generate`), then:

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Deploying the database

```bash

docker run --rm -it \
    --network host \
    -v ./:/backup \
    postgres:16 \
    pg_dump -U root -h localhost -Fc -f /backup/sermonindex.pgsql sermonindex_local

docker run --rm \
  -v $(pwd):/backup \
  postgres:16 \
  pg_restore \
    -d "DATABASE_URL" \
    --jobs=4 \
    --no-owner \
    -v \
    /backup/sermonindex.pgsql
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
