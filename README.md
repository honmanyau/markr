# Markr

> A data ingestion and processing microservice for Markr.

This document describes the prototype of the data processing and storage microservice for Markr. It was created in fulfillment of a take-home coding challenge.

## Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Assumptions](#assumptions)
- [Additional Assumptions](#additional-assumptions)
- [Design and Approach](#design-and-approach)
  - [Endpoints](#endpoints)
  - [Data Models](#data-models)
  - [Tech Stack](#tech-stack)
    - [Server](#server)
    - [Database](#databse)
    - [Testing](#testing)
    - [Deployment](#deployment)
- [Potential Extensions](#potential-extensions)
- [Beginning Remarks](#beginning-remarks)
- [Concluding Remarks](#concluding-remarks)
- [Originality Statement](#originality-statement)

## Quick Start

Clone this repository;

```sh
git clone https://github.com/honmanyau/markr
cd markr
```

Then get started with Docker Compose:

```sh
# Development:
docker-compose up --detach


# Production:
docker-compose -f docker-compose.production.yml up --detach


# Test *only*:
docker-compose run markr-dev npm run test
docker-compose run markr-dev npm run test:verbose
docker-compose run markr-dev npm run test:with-coverage
```

**OR**, alternatively, use NPM instead of Docker Compose:

```sh
npm ci


# Development:
npm run dev


# Production:
npm run build && npm run start # OR npm run start:build


# Test *only*:
npm run test
npm run test:verbose
npm run test:with-coverage
```

Once the server is up and running:

```sh
# Testing that server is up and running:
curl http://localhost:4567

# Status Code: 200
# Output: {"ok":true}


# Testing the '/import' endpoint with by POST-ing a well-formed document:
curl -X POST -H 'Content-Type: text/xml+markr' http://localhost:4567/import -d @- <<XML
  <mcq-test-results>
    <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
      <first-name>Nadeshiko</first-name>
      <last-name>Yamato</last-name>
      <student-number>4224</student-number>
      <test-id>1007</test-id>
      <summary-marks available="20" obtained="19" />
    </mcq-test-result>
  </mcq-test-results>
XML

# Status Code: 201
# Output: {"ok":true}


# Testing the '/import' endpoint with by POST-ing a malformed document:
curl -X POST -H 'Content-Type: text/xml+markr' http://localhost:4567/import -d @- <<XML
  <mcq-test-results>
    <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
      <first-name>Nadeshiko</first-name>
      <last-name>Yamato</last-name>
      <student-number>4224</student-number>
      <test-id>1007</test-id>
      <summary-marks available="20" obtained="19" />
    </mcq-test->
  </mcq-test-results>
XML

# Status Code: 400
# Output: {"ok":false,"statusCode":400,"error":"Bad request.","message":"The document is malformed, has invalid or missing fields."}


# Testing the '/result/:testId/aggregate' endpoint:
curl http://localhost:4567/results/1007/aggregate

# Status Code: 200
# Output: {"testId":"1007","mean":95,"count":1,"p25":95,"p50":95,"p75":95,"min":95,"max":95,"stddev":0}
```

## Development

The development server runs with the help of [`nodemon`](https://nodemon.io). Given that our [Docker Compose file](./docker-compose.yml) bind mounts the host directory to the container's project root, any changes made locally will be reflected on the development server.

To see output on the development server if running detached:

```sh
docker logs markr-dev
```

Alternatively, start the development server without the `--detach` flag, or use NPM.

A list of potentially useful scripts are available in [`package.json`](./package.json). To run these scripts, using linting script as an example:

```sh
# With npm
npm run lint

# With docker-compose
docker-compose run markr-dev npm run lint
```

## Assumptions

The assumptions below are numbered only so that they are easy to refer to — they are written as they pop into my head and do not ordered by importance.

1. A valid document refers to an XML document that, apart from the document header, begins with the `<mcq-test-results>` tag and ends with the `</mcq-test-results>` closing tag. Every entry within the `<mcq-test-results>` element must also be valid.
2. A valid entry, as referred to in (1), begins with the `<mcq-test-result>` tag and ends with the `</mcq-test-result>` tag. The `<mcq-test-result>` element must contain the `scanned-on` attribute with a validate datetime string (parsing with `new Date()` does not return `Invalidate Date`). In addition, it must contain the following children:
   - `<first-name>`
   - `<last-name>`
   - `<student-number>`
   - `<test-id>`
   - `<summary-marks available="number" obtained="number" />` (self-closing), where `available` is >= `obtained`, non-null, and > 0.
3. "A document missing some important bits" in the requirements describes violation of either (1) or (2), and the entire document will be rejected and handled accordingly.
4. The scores given in `<summary-marks>` are always "correct". The microservice will not perform any validation against `<answer>` elements. This is obviously problematic for answers such as that given in the example in the requirements: `<answer question="4 marks-available="1" marks-awarded="1">AC</answer>`; but this implementation wil not handle such cases for scope reasons (and that the boss says it's okay — even though the boss may not be always right).
5. The microservice will not store results for individual answers described by the `<answer>` elements.
6. The boss' threat-model is acceptable for this prototype, and we wil not encrypt the database and localhost traffic. If the container is deployed inside trustworthy infrastructure behind a reverse proxy server that already interfaces with the outside world over TLS/SSL, then it's probably okay.
7. A re-sit test has **the same test ID** as the test that it is meant to augment, and follows the same update rules as those for duplicated records.
8. When an update of scores _may_ occur, `available` takes precedence over `obtained`. If I haven't missed anything, that boils down to:
   - New `available` > old `available` — always update regardless of changes in `obtained`.
   - New `available` == old `available`, `obtained` changes — update if new `obtained` > old `obtained`.

## Additional Assumptions

These are assumptions on issues I realised during development and made in addition to those above.

1. Upload size of the server is arbitrarily set to 256 MB. While there is no indication of what kind of upload size we should expect, it is worth noting that an entry of 20 answers is ~2 KB, so an upload limit of 256 MB should handle > 20000 entries containing 100 answers each.
2. Based on the sample output provided for the `/results/:testId/aggregate` endpoint (`{"mean":65.0,"stddev":0.0,"min":65.0,"max":65.0,"p25":65.0,"p50":65.0,"p75":65.0,"count":1}`), the microservice returns the **population** standard deviation instead of, if I'm not mistaken, the arguably more appropriate **sample** standard deviation (which has degree of freedom `N - 1` and would produce `Infinity` in the case of a single entry).
3. It's unclear what method is required for calculating percentiles. The [nearest-rank method](https://en.wikipedia.org/wiki/Percentile) was chosen for simplicity. In reality, this would likely make negligible difference for larger sample sizes. If required, we can always do linear-interpolation with slight modifications to the current implementation.
4. Student numbers and test IDs are treated as strings at all times. This treatment means that two entries with different student numbers, for example `"001007"` and `"1007"`, are treated as 2 unique entries even if they are otherwise identical.

## Design and Approach

### Endpoints

The microservice will have the following endpoints and methods:

- `/`
  - `GET`
    - Returns `{ ok: true }` (and maybe a message for identifying Markr) to show that the microservice is up and running.
- `/import`
  - `POST`
    - Accepts XML documents sent with the `Content-Type: text/xml+markr` **only**.
    - Rejects malformed documents **with an appropriate HTTP error** ([`415`](https://en.wikipedia.org/wiki/Http_error_codes#4xx_client_errors), I think) according to the requirements. Rejected documents will be "printed out" (in this case we will save the rejected data as a text file to a local directory).
    - For documents that are not rejected, process data as described in the requirements. We will calculate a percentage score for each entry (a pair of student number and test ID) and store it along with the rest of the data in an entry.
- `/results/:test-id/aggregate`
  - `GET`
    - Aggregates results for a given test ID and returns a JSON object that includes `mean`, `count`, `p25`, `p50` and `p75`. Other than `count`, these need to be expressed in percentages. Example given: `{"mean":65.0,"stddev":0.0,"min":65.0,"max":65.0,"p25":65.0,"p50":65.0,"p75":65.0,"count":1}`.
    - ~~(Optional) If time allows, we will also implement standard deviation, minimum and maximum. These are not explicitly stated in the requirements, but would be nice to have (I also just realised maybe I was supposed to ask questions about this?).~~ **Implemented**.
    - (Optional) If time allows, implementing some sort of caching mechanism here would be nice.

### Data Models

For storing scanned results at the `/import` `POST` endpoint:

```
┌────────────────────────┐
│      Result            │
├────────────────────────┤
│    + scannedOn         │
│ PK + studentNumber     │
│ PK + testId            │
│ PK + firstName         │
│ PK + lastName          │
│    + availableMarks    │
│    + obtainedMarks     │
│    + percentageMark    │
├────────────────────────┤
```

For retrieving aggregated statistics at the `/result/:testId/aggregate` `GET` endpoint:

```
┌────────────────────────┐
│      Statistics        │
├────────────────────────┤
│ PK + testId            │
│    + mean              │
│    + count             │
│    + p25               │
│    + p50               │
│    + p75               │
│    + min               │
│    + max               │
│    + stddev            │
├────────────────────────┤
```

### Tech Stack

#### Server

We will use a [Node.js](https://nodejs.org) + [Express](https://expressjs.com) server — mostly because there are not restrictions in the requirements and it's what I'm most familiar with.

Express does introduce a bit of an overhead, but it's nicer to write than vanilla Node.js, and has a nice ecosystem of middlewares that can be dropped in to get the prototype "production-ready" in case this prototype "somehow find its way into production". I did consider Fastify for (potentially) better performance, but I personally find some parts less intuitive the last few times I used it, so I ditched that thought.

Since it is a JavaScript environment, we will also use [TypeScript](https://www.typescriptlang.org) for development!

#### Database

For the DBMS we will use SQLite since there are no strict requirements (well, the team is ignoring me on Slack!), it's just nice and simple to set up and it's file-based. I did consider using a Docker image for PostgreSQL, but I'm not sure how much friction that will end to setting things up for submission later, so I scrapped that thought.

We will use [Sequelize](https://sequelize.org) for interfacing Node.js and SQLite. The choice to use Sequelize here is because we can easily introduce type checking into database models with TypeScript, and we can readily switch between a few SQL dialects in case the team really doesn't like SQLite.

#### Testing

We will use the [Jest](https://jestjs.io) test framework for unit tests. Mostly chosen because of the ease to get it up and running, and that it can easily given an indication of how abysmal code coverage is without additional dependencies. We will also use [`supertest`](https://github.com/visionmedia/supertest) to help with testing endpoints.

#### Deployment

~~It's part of the requirements, nothing much to be said here and included for completeness!~~

Deployment is done using Docker Compose as stated in the requirement. The project directory contains a single `Dockerfile` that is set up to enable multi-stage builds. Two Docker Compose files are used to enable a development build ([`docker-compose.yml`](./docker-compose.yml)), and a production build ([`docker-compose.production.yml`](./docker-compose.yml), concatenated using the `-f` option).

## Potential Extensions

- Printing PDFs of those snail-mailed reports.
- ~~Save rejected documents and~~ log the reason for rejecting.
- Socket.io.
- Implement/optimise request caching — I don't think I'll spend too much time thinking about it in the first pass.

## Beginning Remarks

This section was written before all sections but is placed close to the end of this document because of the following statement:

> At Markr, people don't like to muck around - the most important requirements are therefore at the top of the list.

It may be worth noting that I read through the requirements 3 days ago and therefore already had a bit of a think about this for a few days. This section contains personal remarks "as I go" and read the requirements again, and is meant to be guidelines to myself.

I personally find that the estimated time of 2–3 hours for completing this challenge is non-trivial. While hacking together a working prototype within 3 hours is definitely possible, meeting most of the requirements described in the requirements will likely require the following time spent:

| Task                                                         | Duration / hour |
| ------------------------------------------------------------ | --------------- |
| (Re-)reading, planning, designing, and writing documentation | 1.0             |
| Project setup                                                | 0.5             |
| Producing a functional prototype                             | 1.5             |
| Basic error handling and tests                               | 0.5             |
| Cleaning up, refactoring, and _small_ optimisations          | 1.0             |
| Docker setup\*                                               | 0.5             |
| Making sure that everything works before submission          | 1.0             |

\* Not including the time needed to familiarise myself with Docker Compose since I haven't used that feature before.

The total time required for the tasks listed above is already 6 hours, and applying a conservative multiplier brings us too 9 hours — which sounds more realistic as an investment for a prototype that may "somehow find its way into production". At this point I must say that I'm honestly a bit nervous (and I thought I was going to calm myself by budgeting time first...) — this could mean my estimated scope is already too big compared to what is expected; my ability is below expectation; or both.

In any case, there is one way to move forward. The plan is to hack a fully functional prototype within 3 hours, and then incrementally address all of the requirements that are not met or of subpar qualities. Time to get started.

## Concluding Remarks

I ended up taking the amount of time I estimated conservatively at the beginning to get to the first, fully-working prototype. Perhaps surprisingly, I stressed a bit more than I thought I would for a take-home assignment, and that contributed to spending time on fussing about small details.

Overall it was a fun assignment and, albeit taking longer than I would like. There is still refactoring that I would like to do, and features to implement (mostly an excuse to play with Socket.io) — but it has to stop somewhere.

To avoid making this sound like some creepy self-analysis and over-analysing my own work to the point that I start sprouting nonsense, I should reeeeally stop here and now.

## Originality Statement

I hereby declare that this submission is my own work, and due references are made to code or ideas that heavily influenced this submission.
