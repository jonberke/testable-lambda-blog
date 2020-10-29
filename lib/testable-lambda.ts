import { StackProps, Construct } from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codedeploy from '@aws-cdk/aws-codedeploy'
import * as cloudwatch from '@aws-cdk/aws-cloudwatch'

interface TestableLambdaProps extends StackProps {
  mainFunction: lambda.Function
  testFunction: lambda.Function
  deploymentConfig: codedeploy.ILambdaDeploymentConfig
  alarms?: cloudwatch.Alarm[]
  liveAliasName?: string
}

export class TestableLambda extends Construct {
  readonly liveAlias: lambda.Alias

  constructor(scope: Construct, id: string, props: TestableLambdaProps) {
    super(scope, id)

    const aliasName = props.liveAliasName || 'live'

    // The mainFunction's code property must use fromAsset() of fromInline() for the CDK to
    // automatically detect changes
    const newVersion = props.mainFunction.currentVersion
    this.liveAlias = newVersion.addAlias(aliasName)

    props.testFunction.addEnvironment('FUNCTION_TO_INVOKE', newVersion.functionArn)
    newVersion.grantInvoke(props.testFunction)

    new codedeploy.LambdaDeploymentGroup(this, `DeploymentGroup`, {
      alias: this.liveAlias,
      deploymentConfig: props.deploymentConfig,
      preHook: props.testFunction,
      alarms: props.alarms
    })
  }
}
