import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { AWS } from './AWS';
import { environmentVariables } from './environmentVariables';

const ALLOWED_HEADERS = [
  'X-Authorization',
  'X-Authorization',
  'Authorization',
  'authorization',
  'x-api-key',
];

let API_KEY: string | undefined = undefined;

/**
 * Takes the API gateway event and tries to authenticate it.
 * The API key is loaded an cached using API_KEY_ARN env variable (which must be set).
 * The API key must have a `Token ` prefix and can be in the following headers
 *   - 'X-Authorization'
 *   - 'X-Authorization'
 *   - 'Authorization'
 *   - 'authorization'
 *   - 'x-api-key'
 * @param event 
 * @returns - true when authentication was sucessful throws an error otherwise
 */
export async function authenticate(event: APIGatewayProxyEvent | APIGatewayProxyEventV2) {
  if (!API_KEY) {
    const env = environmentVariables(['API_KEY_ARN']);
    API_KEY = await AWS.getSecret(env.API_KEY_ARN);
  }

  if (!API_KEY) {
    throw new Error('API_KEY was not loaded, is API_KEY_ARN env variable set?');
  }

  if (!event.headers) {
    throw new Error('No headers avaialble to check for API key');
  }

  const usedHeader = ALLOWED_HEADERS.find(h => event.headers[h] != undefined);
  if (!usedHeader) {
    throw new Error('No headers available to check for API key');
  }

  const header = event.headers[usedHeader];

  if (!header) {
    throw new Error('No Authorization header found in the request.');
  }

  if (!header.startsWith('Token ')) {
    throw new Error('Authorization header must have a token prefix');
  }

  if (header.substring('Token '.length) === API_KEY) {
    return true;
  }

  throw new Error('Invalid API Key');
}