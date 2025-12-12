import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * NoSQL Sanitizer Pipe
 * Prevents NoSQL injection attacks by:
 * 1. Stripping MongoDB query operators (keys starting with $)
 * 2. Removing prototype pollution attempts (__proto__, constructor)
 * 3. Converting objects to safe string values where expected
 */
@Injectable()
export class NoSqlSanitizerPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    return this.sanitize(value);
  }

  private sanitize(value: unknown): unknown {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    // Handle objects
    if (typeof value === 'object') {
      return this.sanitizeObject(value as Record<string, unknown>);
    }

    // Handle strings - check for injection patterns
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    // Return primitives as-is
    return value;
  }

  private sanitizeObject(
    obj: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      // Block MongoDB operators and prototype pollution
      if (this.isDangerousKey(key)) {
        throw new BadRequestException(
          `Invalid input: dangerous key detected "${key}"`,
        );
      }

      // Recursively sanitize nested values
      sanitized[key] = this.sanitize(obj[key]);
    }

    return sanitized;
  }

  private sanitizeString(value: string): string {
    // Remove null bytes that could bypass validation
    return value.replace(/\0/g, '');
  }

  private isDangerousKey(key: string): boolean {
    // Block MongoDB query operators
    if (key.startsWith('$')) {
      return true;
    }

    // Block prototype pollution attempts
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    if (dangerousKeys.includes(key.toLowerCase())) {
      return true;
    }

    return false;
  }
}

/**
 * Utility function to sanitize a single value for direct use in queries
 * Use this when you need to sanitize a value before passing to MongoDB
 */
export function sanitizeMongoQuery<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Return the sanitized string
    return value.replace(/\0/g, '') as T;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    // Check for injection attempts in object values
    const obj = value as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (
        key.startsWith('$') ||
        ['__proto__', 'constructor', 'prototype'].includes(key)
      ) {
        throw new BadRequestException('Invalid query parameter detected');
      }
    }
  }

  return value;
}

/**
 * Ensures a value is a plain string, not an object that could be a MongoDB operator
 */
export function ensureString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new BadRequestException('Expected string value');
  }
  return value.replace(/\0/g, '');
}
