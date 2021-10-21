import { Construct } from "@aws-cdk/core";
import { IFunction, Runtime, Code, Function } from "@aws-cdk/aws-lambda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

export interface HitCounterProps {
    downstream: IFunction;
}

export class HitCounter extends Construct {

    public readonly handler: Function;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const table = new Table(this, 'Hits', {
            partitionKey: { name: 'path', type: AttributeType.STRING }
        });

        this.handler = new Function(this, 'HitCounterHandler', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'hitcounter.handler',
            code: Code.fromAsset('lambda'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        });

        table.grantReadWriteData(this.handler);

        props.downstream.grantInvoke(this.handler);

    }
}