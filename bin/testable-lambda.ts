#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestableLambdaStack } from '../lib/testable-lambda-stack';

const app = new cdk.App();
new TestableLambdaStack(app, 'TestableLambdaStack');
