# sermonindex-api

An api for the SermonIndex content

## Installation

```bash
$ npm install
```

## Setting up the Database

**Note:**: Currently the postgresql db is seeded with production data via a [script](./prisma/old_schema/convert-schema.ts) that migrates the data from the current mysql db json file exports. This will be removed once the final schema is determined and moves to production.

**Note:**: If you make changes to the seed script or pull changes to the api you will most likely want to nuke the db and start from scratch: `rm -rf prisma/migrations && docker-compose up --force-recreate`

```bash
# Start a postgresql container
$ docker-compose up

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

- return sermon count on contributor
- Add descriptions and references to video sermons
- Add descriptions to audio sermons
- Add manuscript table for sermon text (audio and video)
- search sermons & contributors endpoint
- pagination
- swagger docs
- api client
- contract tests
