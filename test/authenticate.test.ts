import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { authenticate } from '../src/authenticate';
import { AWS } from '../src/AWS';


beforeAll(() => {
  process.env.API_KEY_ARN = 'api-key-arn';
});

describe('Authentication', () => {

  test('No key loaded returns 401', async () => {
    jest.spyOn(AWS, 'getSecret').mockImplementation((_arn) => {
      return Promise.resolve(undefined) as any;
    });
    const event: Partial<APIGatewayProxyEventV2> = {
      headers: {
      },
    };
    await expect(authenticate(event as any)).rejects.toThrow();
  });


  test('No key in request returns 401', async () => {
    jest.spyOn(AWS, 'getSecret').mockImplementation((_arn) => {
      return Promise.resolve('geheim');
    });
    const event: Partial<APIGatewayProxyEventV2> = {
      headers: {
      },
    };
    await expect(authenticate(event as any)).rejects.toThrow();
  });

  test('Wrong key in request returns 401', async () => {
    jest.spyOn(AWS, 'getSecret').mockImplementation((_arn) => {
      return Promise.resolve('geheim');
    });
    const event: Partial<APIGatewayProxyEventV2> = {
      headers: {
        Authorization: 'abc',
      },
    };
    await expect(authenticate(event as any)).rejects.toThrow();
  });

  test('Success using authorization', async () => {
    jest.spyOn(AWS, 'getSecret').mockImplementation((_arn) => {
      return Promise.resolve('geheim');
    });
    const event: Partial<APIGatewayProxyEventV2> = {
      headers: {
        Authorization: 'Token geheim',
      },
    };
    const result = await authenticate(event as any);
    expect(result).toBe(true);
  });

  test('Success using x-api-key', async () => {
    jest.spyOn(AWS, 'getSecret').mockImplementation((_arn) => {
      return Promise.resolve('geheim');
    });
    const event: Partial<APIGatewayProxyEventV2> = {
      headers: {
        'x-api-key': 'Token geheim',
      },
    };
    const result = await authenticate(event as any);
    expect(result).toBe(true);
  });

});