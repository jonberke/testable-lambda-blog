import * as cdk from '@aws-cdk/core';
import * as apig from '@aws-cdk/aws-apigatewayv2'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codedeploy from '@aws-cdk/aws-codedeploy'
import { TestableLambda } from './testable-lambda'

export class TestableLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mainFunction = new lambda.Function(this, 'main', {
      code: lambda.Code.fromAsset('lambdas/main/'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X
    })

    const testFunction = new lambda.Function(this, 'test', {
      code: lambda.Code.fromAsset('lambdas/test/'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X
    })

    const testableLambda = new TestableLambda(this, 'testable-lambda', {
      mainFunction,
      testFunction,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE
    })

    // Use testableLambda.liveAlias to integrate with other services like API Gateway
    const api = new apig.HttpApi(this, 'testable-lambda-api')
    api.addRoutes({
      methods: [apig.HttpMethod.POST],
      path: '/',
      integration: new apig.LambdaProxyIntegration({ handler: testableLambda.liveAlias })
    })
    new cdk.CfnOutput(this, 'apiUrl', {
      value: `https://${api.httpApiId}.execute-api.${cdk.Aws.REGION}.amazonaws.com/`
    })
  }
}
