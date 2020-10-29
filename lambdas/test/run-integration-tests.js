const { CodeDeploy } = require('aws-sdk')
const codeDeploy = new CodeDeploy({ apiVersion: '2014-10-06' })

exports.runIntegrationTests = async (event, tests) => {
  let status = 'Succeeded'
  try {
    // All tests run concurrently
    await Promise.all(tests)
  } catch (e) {
    console.log('Error running test: ' + e)
    status = 'Failed'
  }

  await codeDeploy.putLifecycleEventHookExecutionStatus({
    status,
    deploymentId: event.DeploymentId,
    lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId
  }).promise()

  console.log('Final deployment status: ' + status)
}
