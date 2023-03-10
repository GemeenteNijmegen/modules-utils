import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { mockClient } from 'aws-sdk-client-mock';
import { AWS } from '../src/AWS';

const secretsMock = mockClient(SecretsManagerClient);
const ssmMock = mockClient(SSMClient);

beforeEach(() => {
  secretsMock.reset();
  ssmMock.reset();
});

describe('Get parameter tests', () => {

  const paramValue = 'Parameter test value';

  test('Ok', async () => {
    ssmMock.on(GetParameterCommand).resolves({
      Parameter: { Value: paramValue },
    });
    const param = await AWS.getParameter('/cdk/path/to/ssm/param');
    expect(param).toBe(paramValue);
  });

  test('Undefined', async () => {
    ssmMock.on(GetParameterCommand).resolves({
      Parameter: { Value: undefined },
    });

    /* eslint-disable */
    // We need a floating promise to check if it is rejected with the correct error message
    const param = AWS.getParameter('/cdk/path/to/ssm/param');
    expect(param).rejects.toThrowError('No parameter value found');
    /* eslint-enable */
  });

  test('Client errors are thrown', async () => {
    ssmMock.on(GetParameterCommand).rejects('Rejected');

    /* eslint-disable */
    // We need a floating promise to check if it is rejected with the correct error message
    const param = AWS.getParameter('/cdk/path/to/ssm/param');
    expect(param).rejects.toThrowError('Rejected');
    /* eslint-enable */
  });

});

describe('Get secret tests', () => {

  const secretValue = 'Secret test value';

  test('Ok', async () => {
    secretsMock.on(GetSecretValueCommand).resolves({
      SecretString: secretValue,
    });
    const secret = await AWS.getSecret('/cdk/path/to/secrets');
    expect(secret).toBe(secretValue);
  });

  test('Undefined', async () => {
    secretsMock.on(GetSecretValueCommand).resolves({
      SecretString: undefined,
    });

    /* eslint-disable */
    // We need a floating promise to check if it is rejected with the correct error message
    const secret = AWS.getSecret('/cdk/path/to/ssm/param');
    expect(secret).rejects.toThrowError('No secret value found');
    /* eslint-enable */
  });

  test('Client errors are thrown', async () => {
    secretsMock.on(GetSecretValueCommand).rejects('Rejected');

    /* eslint-disable */
    // We need a floating promise to check if it is rejected with the correct error message
    const secret = AWS.getSecret('/cdk/path/to/ssm/param');
    expect(secret).rejects.toThrowError('Rejected');
    /* eslint-enable */
  });

});

