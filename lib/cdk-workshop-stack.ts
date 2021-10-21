import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import { LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { HitCounter } from "./hitcounter";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    // new LambdaRestApi(this, 'Endpoint', {
    //   handler: hello
    // });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

  }
}
