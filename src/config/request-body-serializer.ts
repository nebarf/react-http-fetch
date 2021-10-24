import { ReqBodySerializerReturn } from '.';

/**
 * Safely assert whether the given value is an ArrayBuffer.
 *
 * In some execution environments ArrayBuffer is not defined.
 */
function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

/**
 * Safely assert whether the given value is a Blob.
 *
 * In some execution environments Blob is not defined.
 */
function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

/**
 * Safely assert whether the given value is a FormData instance.
 *
 * In some execution environments FormData is not defined.
 */
function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

/**
 * Safely assert whether the given value is a URLSearchParams instance.
 *
 * In some execution environments URLSearchParams is not defined.
 */
function isUrlSearchParams(value: unknown): value is URLSearchParams {
  return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
}

export function serializeRequestBody(body: BodyInit): ReqBodySerializerReturn {
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

  // Check whether the body is an object or array, and serialize with JSON if so.
  if (typeof body === 'object' || typeof body === 'boolean' || Array.isArray(body)) {
    return JSON.stringify(body);
  }

  // Fall back to unmodified body.
  return body;
}
