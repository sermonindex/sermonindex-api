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

Unfortunately the database dump is too large to host on GitHub. You'll need to download it from [here](https://drive.google.com/file/d/1uMFtwCr6kb3TRLwDr034XiftNBge9RkV/view?usp=drive_link) and save it in the project's root directory. Currently we're using all the production data to get a better feel for what the POC will look like, but in the future the api will only seed a small amount of data into a container for test purposes and this step will no longer be required for api deveopment.

Once you've downloaded the database dump:

```bash
# Start the postgresql container (use --force-recreate to start from scratch)
docker-compose up

# Apply schema migrations
npx prisma migrate dev

# Seed the data
docker exec -i si-api_pgsql_1 pg_restore --verbose --clean --no-owner --no-privileges -U root -d sermonindex_local < ./sermonindex.dump
```

**Note:**: If you've setup the db before with the previous methods, you'll need to destroy the postgres container: `docker rm si-api_pgsql_1`

## Dumping the Database

Any changes to the schema or db content will need to be dumped:

```bash
docker run --rm -it \
    --network host \
    -v ./:/backup \
    postgres:16 \
    pg_dump -U root -h localhost -F c -b -v -f /backup/sermonindex.dump sermonindex_local
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

- remove csv-parse, jsdom, @types/jsdom, titlecase dependencies once db scrubbing complete
- contributor images endpoint
- search sermons & contributors endpoint
- pagination
- swagger docs
- api client
- contract tests
