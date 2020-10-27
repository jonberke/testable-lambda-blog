import { StackProps, Construct } from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codedeploy from '@aws-cdk/aws-codedeploy'

interface TestableLambdaProps extends StackProps {
  mainFunction: lambda.Function
  testFunction: lambda.Function
  deploymentConfig: codedeploy.ILambdaDeploymentConfig
  liveAliasName?: string
}

export class TestableLambda extends Construct {
  readonly liveAlias: lambda.Alias

  constructor(scope: Construct, id: string, props: TestableLambdaProps) {
    super(scope, id)

    const aliasName = props.liveAliasName || 'live'

    const newVersion = props.mainFunction.currentVersion
    this.liveAlias = newVersion.addAlias(aliasName)

    props.testFunction.addEnvironment('FUNCTION_TO_INVOKE', newVersion.functionArn)
    newVersion.grantInvoke(props.testFunction)

    new codedeploy.LambdaDeploymentGroup(this, `DeploymentGroup`, {
      alias: this.liveAlias,
      deploymentConfig: props.deploymentConfig,
      preHook: props.testFunction,
    })
  }
}
