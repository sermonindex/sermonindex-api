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

Unfortunately the database dump is too large to host on GitHub. You'll need to download it from [here](https://drive.google.com/file/d/16DLt8Qvst6wHuNWl5kAEmw5cs7Bs6qVx/view?usp=drive_link), extract it, and save it in the project's root directory. Currently we're using all the production data to get a better feel for what the POC will look like, but in the future the api will only seed a small amount of data into a container for test purposes and this step will no longer be required for api development.

Once you've downloaded the database dump:

```bash
# Start the postgresql container (use --force-recreate to start from scratch)
docker-compose up

# Seed the data
docker exec -i si-api-pgsql-1 psql --echo-errors -U root -d sermonindex_local < ./sermonindex.sql
```

**Note:**: If you've setup the db before with the previous methods, you'll need to destroy the postgres container: `docker rm si-api-pgsql-1`

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

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## TODOs

- add language column to sermons in prep for multi-language support
- pull out Martyrs of the Catacombs
- remove duplicate/misspelt topics
- if the contributor doesn't have a description or image, update them...
- replace speaker images with cdn url: https://sermonindex3.b-cdn.net/pdf/andrewmurray.png
- remove ~Miscellaneous Contributor
- remove csv-parse, jsdom, @types/jsdom, titlecase dependencies once db scrubbing complete
- contributor images endpoint
- search sermons & contributors endpoint
- pagination
- swagger docs
- api client
- contract tests
