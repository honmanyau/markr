# Markr

> A data ingestion and processing microservice for Markr.

This document describes the prototype of the data processing and storage microservice for Markr. It was created in fulfillment of a take-home coding challenge.

## Table of Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [Assumptions](#assumptions)
* [Design and Approach](#design-and-approach)
  * [Endpoints](#endpoints)
* [Potential Extensions](#potential-extensions)
* [Originality Statement](#originality-statement)
* [Beginning Remarks](#beginning-remarks)
* [Closing Remarks](#closing-remarks)
* [Unorganised](#unorganised)

## Installation

## Quick Start

## Assumptions

The assumptions below are numbered only so that they are easy to refer to — they are written as they pop into my head and do not ordered by importance.

1. A valid document refers to an XML document that, apart from the document header, begins with the `<mcq-test-results>` tag and ends with the `</mcq-test-results>` closing tag. Every entry within the `<mcq-test-results>` element must also be valid.
2. A valid entry, as referred to in (1), begins with the `<mcq-test-result>` tag and ends with the `</mcq-test-result>` tag. The `<mcq-test-result>` element must contain the `scanned-on` attribute with a validate datetime string (parsing with `new Date()` does not return `Invalidate Date`). In addition, it must contain the following children:
  * `<first-name>`
  * `<last-name>`
  * `<student-number>`
  * `<test-id>`
  * `<summary-marks available="number" obtained="number" />` (self-closing), where `available` is >= `obtained`, non-null, and > 0.
3. "A document missing some important bits" in the requirements describes violation of either (1) or (2), and the entire document will be rejected and handled accordingly.
4. The scores given in `<summary-marks>` are always "correct". The microservice will not perform any validation against `<answer>` elements. This is obviously problematic for answers such as that given in the example in the requirements: `<answer question="4 marks-available="1" marks-awarded="1">AC</answer>`; but this implementation wil not handle such cases for scope reasons (and that the boss says it's okay — even though the boss may not be always right).
5. The microservice will not store results for individual answers described by the `<answer>` elements.
6. The boss' threat-model is acceptable for this prototype, and we wil not encrypt the database and localhost traffic. If the container is deployed inside trustworthy infrastructure behind a reverse proxy server that already interfaces with the outside world over TLS/HTTPS, then it's probably okay.
7. A re-sit test has **the same test ID** as the test that it is meant to augment, and follows the same update rules as those for duplicated records.
8. When an update of scores *may* occur, `available` takes precedence over `obtained`. If I haven't missed anything, that boils down to:
  * New `available` > old `available` — always update regardless of changes in `obtained`.
  * New `available` == old `available`, `obtained` changes — update if new `obtained` > old `obtained`.

## Design and Approach

### Endpoints

The microservice will have the following endpoints and methods:

  * `/`
    * `GET`
      * Returns `{ ok: true }` (and maybe a message for identifying Markr) to show that the microservice is up and running.
  * `/import`
    * `POST`
      * Accepts XML documents sent with the `Content-Type: text/xml+markr` **only**.
      * Rejects malformed documents **with an appropriate HTTP error** ([`415`](https://en.wikipedia.org/wiki/Http_error_codes#4xx_client_errors), I think) according to the requirements. Rejected documents will be "printed out" (in this case we will save the rejected data as a text file to a local directory).
      * For documents that are not rejected, process data as described in the requirements. We will calculate a percentage score for each entry (a pair of student number and test ID) and store it along with the rest of the data in an entry.
  * `/results/:test-id/aggregate`
    * `GET`
      * Aggregrates results for a given test ID and returns a JSON object that includes `mean`, `count`, `p25`, `p50` and `p75`. Other than `count`, these need to be expressed in percentages. Example given: `{"mean":65.0,"stddev":0.0,"min":65.0,"max":65.0,"p25":65.0,"p50":65.0,"p75":65.0,"count":1}`.
      * (Optional) If time allows, we will also implement standard deviation, minimum and maximum. These are not explicitly stated in the requirements, but would be nice to have (I also just realised maybe I was supposed to ask questions about this?).
      * (Optional) If time allows, implementing some sort of caching mechanism here would be nice.

## Potential Extensions

## Originality Statement

## Beginning Remarks

This section was written before all sections but is placed close to the end of this document because of the following statement:

> At Markr, people don't like to muck around - the most important requirements are therefore at the top of the list.

It may be worth noting that I read through the requirements 3 days ago and therefore already had a bit of a think about this for a few days. This section contains personal remarks "as I go" and read the requirements again, and is meant to be guidelines to myself.

I personally find that the estimated time of 2–3 hours for completing this challenge is non-trivial. While hacking together a working prototype within 3 hours is definitely possible, meeting most of the requirements described in the requirements will likely require the following time spent:

| Task | Duration / hour |
| ---- | --------------- |
| (Re-)reading, planning, designing, and writing documentation | 1.0 |
| Project setup | 0.5 |
| Producing a functional prototype | 1.5 |
| Basic error handling and tests | 0.5 |
| Cleaning up, refactoring, and *small* optimisations | 1.0 |
| Docker setup\* | 0.5 |
| Making sure that everything works before submission | 1.0 |

\* Not including the time needed to familiarise myself with Docker Compose since I haven't used that feature before.

The total time required for the tasks listed above is already 6 hours, and applying a conservative multiplier brings us too 9 hours — which sounds more realistic as an investment for a prototype that may "somehow find its way into production". At this point I must say that I'm honestly a bit nervous (and I thought I was going to calm myself by budgeting time first...) — this could mean my estimated scope is already too big compared to what is expected; my ability is below expectation; or both.

In any case, there is one way to move forward. The plan is to hack a fully functional prototype within 3 hours, and then incrementally address all of the requirements that are not met or of subpar qualities. Time to get started.

## Closing Remarks

## Unorganised

These should probably go into extensions:

* Fallback import handling.
* Printing PDFs of those snail-mailed reports.
* Save rejected documents and log the reason for rejecting.
* Socket.io.
* Implement/optimise request caching — I don't think I'll spend too much time thinking about it in the first pass.