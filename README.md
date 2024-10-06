# sermonindex-api

An api for the SermonIndex content

## Installation

```bash
$ npm install
```

## Setting up the Database

**Note:**: Currently the postgresql db is seeded with production data via a [script](./prisma/old_schema/convert-schema.ts) that migrates the data from the current mysql db json file exports. This will be removed once the final schema is determined and moves to production.

**Note:**: This is a one-time setup (unless you make changes to the seed script). In that case you will need to recreate the docker container.

```bash
# Start a postgresql container
$ docker-compose up -d

# Create the db/tables in postgresql
$ npx prisma migrate dev --name init

# **NOTE** This command will take several minutes. Seed the db with prod data.
$ npx ts-node prisma/old_schema/convert-schema.ts

# Generate ts types from prisma schema for api
$ npx prisma generate
```

## Running the app

Ensure the postgresql db is up (via `docker-compose up`), then:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TODOs

- get sermons by bible reference
- get sermons by topic
- search sermons / contributors
- define return types
- pagination
- validate requests (partially complete)
- swagger docs
- api client
- contract tests
