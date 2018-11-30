# TypeScript React Application

## Coder: Matt Ulmer

---
## Description

This is a full stack Node.js application that is integrated with Google Cloud and CircleCI for test automation/deployment.

---
## Setup

#### Dependencies:

1. Docker must be installed to setup the local postgres database. The version of the image used is reflective of the version of postgres on Google Cloud.

2. Node Version: v11.3.0

3. NPM Version: v6.2.0

In order to get this application running locally, first run these commands:

```
cd client && npm ci
cd ../server && npm ci
```

This will download the necessary dependencies for the frontend and backend. `ci` is used instead of the standard `install` since it is faster and uses the exact versions of those dependencies in the `package-lock.json`, allowing for truly repeatable builds.

#### Starting Locally:

While still in the `./server` directory, all that you need to do to get the application running locally is to run the command:

```
npm run dev
```

This will use the node module `concurrently` to run the scripts `dev:server` and `dev:client`. The first of which will spin up a Postgres instance in a Docker container and run sql commands to create and populate tables. The second will run the `start` command of the `./client/package.json` file.

---
## Testing

Tests can be run while still in the `./server` directory by using the command:

```
npm test
```

This again spins up a local postgres instance, runs tests on the backend, and then finally stops and removes the local postgres container regardless of if the tests pass or not. The `mocha` test framework is used as well as the `chai` assertion library.

Note: When deploying through the CircleCI pipeline, their version of a postgres image is used for testing, which is why there is a `test:cicd` script.

---
## Deployment

#### CircleCI:

This repo's CircleCI configuration can be found in the `./.circleci/.config.yml` file. As of right now, it operates as follows:

1. Tests are run against branches that make pull requests.
2. Once the tests pass, the branch can the be merged.
3. After the merge to the `master` branch, the pipeline is kicked off again, but in addition to the testing, a Docker image of the application is made (using the `npm start` command), uploaded to Google's Container Registry, and Deployed to Google's App Engine.

Notes:

In order to successfully upload the image and deploy it, a service account must be made that has `App Engine Admin` and `Storage Admin` privileges.

#### Build Process

When `npm start` is called, the `prestart` script is called initially which first checks if the code has been formatted properly using `tslint`. If that fails the process stops here. Otherwise the actually artifacts for the frontend and backend are built, the server artifact is started which in turn serves up the frontend artifact.

---
## Documentation
The OpenAPI specification can be viewed at: 

```
http//localhost:8080/api/docs
```