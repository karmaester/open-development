import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../src/common/zod-validation.pipe.js';

const TestSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(TestSchema);

  it('should pass valid data through', () => {
    const input = { name: 'Alice', age: 30 };
    const result = pipe.transform(input);
    expect(result).toEqual(input);
  });

  it('should strip unknown fields', () => {
    const input = { name: 'Alice', age: 30, extra: 'field' };
    const result = pipe.transform(input);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should throw BadRequestException for invalid data', () => {
    const input = { name: '', age: -5 };
    expect(() => pipe.transform(input)).toThrow(BadRequestException);
  });

  it('should include field errors in exception', () => {
    const input = { name: '', age: -5 };
    try {
      pipe.transform(input);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse();
      expect(response).toHaveProperty('message', 'Validation failed');
      expect(response).toHaveProperty('errors');
    }
  });

  it('should throw for missing required fields', () => {
    const input = {};
    expect(() => pipe.transform(input)).toThrow(BadRequestException);
  });

  it('should throw for wrong types', () => {
    const input = { name: 123, age: 'not a number' };
    expect(() => pipe.transform(input)).toThrow(BadRequestException);
  });
});
