import {
  isArrayBuffer,
  isBlob,
  isBoolean,
  isFormData,
  isNumber,
  isObject,
  isUrlSearchParams,
} from '../shared';
import { ReqBodySerializerReturn } from './types';

export function serializeRequestBody(body: unknown): ReqBodySerializerReturn {
  // If no body is present, no need to serialize it.
  if (body === null || typeof body === 'undefined') {
    return null;
  }

  // Check whether the body is already in a serialized form. If so,
  // it can just be returned directly.
  if (
    isArrayBuffer(body) ||
    isBlob(body) ||
    isFormData(body) ||
    isUrlSearchParams(body) ||
    typeof body === 'string'
  ) {
    return body;
  }

  // Check whether the body is an object, an array, a boolean or a number, and serialize with JSON if so.
  if (isObject(body) || isBoolean(body) || isNumber(body) || Array.isArray(body)) {
    return JSON.stringify(body);
  }

  // Fallback to body string literal.
  return `${body}`;
}
