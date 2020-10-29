const { invokeLambda } = require('./invoke-lambda')
const testEvent = require('./test-one-event.json')

exports.testOne = async () => {
  const testString = 'this is a test'
  testEvent.body = testString

  const resp = await invokeLambda({
    Payload: JSON.stringify(testEvent)
  })

  // For asynchronous invocations, sleep for long enough for the process to complete and then check
  // the backend resources (e.g., DynamoDB) to make sure the main function succeeded
  
  // The Lambda being tested should simply parrot back the body it received in the POST
  if (!resp.Payload.includes(testString)) {
    console.log(`Unexpected response \nExpecting: ${testString} \nReceived: ${resp}`)
    return Promise.reject(`Unexpected response ${resp}`)
  }
}
