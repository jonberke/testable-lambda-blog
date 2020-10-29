# About
This repo contains the source code referred to in the [Testable Lambda blog post](https://outwiththeold.info/posts/testable-lambda/)

# Prerequisite
This project requires the following tools to be installed:

* [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites)
* [TypeScript](https://www.typescriptlang.org/#installation)
* [Docker](https://docs.docker.com/get-docker/)

# Deployment
Don't forget to run `npm install` before deploying for the fist time.

1. `npm run build`
1. `cdk deploy`

# Cleanup

* Delete the stack from the AWS console or run `cdk destroy`
