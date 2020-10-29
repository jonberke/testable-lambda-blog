const { Lambda } = require('aws-sdk')
const lambda = new Lambda({ apiVersion: '2015-03-31' })

// Small wrapper around lambda.invoke() to help with integration tests:
// * Synchronously invokes the function defined by the FUNCTION_TO_INVOKE environment variable
// * Converts non-200 invoke status codes to Promise rejections
exports.invokeLambda = async (overrides) => {
  const params = {
    FunctionName: process.env.FUNCTION_TO_INVOKE,
    InvocationType: 'RequestResponse' // Pass in 'Event' for asynchronous invocations
  }

  const resp = await lambda.invoke(Object.assign(params, overrides)).promise()

  if (resp.StatusCode !== 200) {
    const errorMessage = `Invalid status code invoking ${params.FunctionName}`
    console.log(`${errorMessage} \nResponse = ${JSON.stringify(resp, null, 2)}`)
    return Promise.reject(errorMessage)
  }

  return Promise.resolve(resp)
}
