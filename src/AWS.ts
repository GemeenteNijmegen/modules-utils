import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

/**
 * Utility class for interacting with AWS from inside lambdas.
 */
export class AWS {

  /**
   * Retrieves a secret from the secrets store given an ARN
   * Note: only string secrets are supported (binary values are ignored).
   * @param arn 
   * @returns the secret as a string
   */
  static async getSecret(arn: string) : Promise<string> {
    const secretsManagerClient = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: arn });
    const data = await secretsManagerClient.send(command);
    if (data?.SecretString) {
      return data.SecretString;
    }
    throw new Error('No secret value found');
  }

  /**
   * Get a parameter from parameter store.
   * @param {string} name Name of the ssm param
   * @returns param value
   */
  static async getParameter(name: string) : Promise<string> {
    const client = new SSMClient({});
    const command = new GetParameterCommand({ Name: name });
    const data = await client.send(command);
    if(data.Parameter?.Value){
      return data.Parameter?.Value
    }
    throw new Error('No parameter value found');
  }

}