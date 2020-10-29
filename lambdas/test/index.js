const { runIntegrationTests } = require('./run-integration-tests')
const { testOne } = require('./test-one')

exports.handler = async (event) => {
  // Define and pass in as many integration tests as you need. Each test run concurrently
  await runIntegrationTests(event, [
    testOne()
  ])
}
