import { APIResponse } from '@playwright/test';
import { ErrorMessage } from '../models/common.model';

export async function getResponse(response: APIResponse) {
  if (!response.ok()) {
    const errorBody: ErrorMessage = await response.json();
    throw new Error(`Status: ${response.status()}, Message: ${errorBody.error}, EP: ${response.url()}`);
  }
  return response;
}

export async function getResponseBodyJson<T>(response: APIResponse) {
  if (!response.ok()) {
    const errorBody: ErrorMessage = await response.json();
    throw new Error(`Status: ${response.status()}, Message: ${errorBody.error}, EP: ${response.url()}`);
  }
  const responseBody: T = await response.json();
  return responseBody;
}
