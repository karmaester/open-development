import { describe, it, expect } from 'vitest';
import { normalizeCountry } from '../src/transformers/normalize-country.js';

describe('normalizeCountry', () => {
  describe('direct alias lookup', () => {
    it('should normalize "United States" to USA', () => {
      expect(normalizeCountry('United States')).toBe('USA');
    });

    it('should normalize "United States of America" to USA', () => {
      expect(normalizeCountry('United States of America')).toBe('USA');
    });

    it('should normalize "Korea, Rep." to KOR', () => {
      expect(normalizeCountry('Korea, Rep.')).toBe('KOR');
    });

    it("should normalize \"Côte d'Ivoire\" to CIV", () => {
      expect(normalizeCountry("Côte d'Ivoire")).toBe('CIV');
    });

    it('should normalize "Ivory Coast" to CIV', () => {
      expect(normalizeCountry('Ivory Coast')).toBe('CIV');
    });

    it('should normalize "Deutschland" to DEU', () => {
      expect(normalizeCountry('Deutschland')).toBe('DEU');
    });

    it('should normalize "Brasil" to BRA', () => {
      expect(normalizeCountry('Brasil')).toBe('BRA');
    });

    it('should normalize "Holland" to NLD', () => {
      expect(normalizeCountry('Holland')).toBe('NLD');
    });

    it('should normalize "Burma" to MMR', () => {
      expect(normalizeCountry('Burma')).toBe('MMR');
    });

    it('should normalize "Ceylon" to LKA', () => {
      expect(normalizeCountry('Ceylon')).toBe('LKA');
    });

    it('should normalize "Egypt, Arab Rep." to EGY', () => {
      expect(normalizeCountry('Egypt, Arab Rep.')).toBe('EGY');
    });
  });

  describe('case insensitivity', () => {
    it('should handle uppercase input', () => {
      expect(normalizeCountry('GERMANY')).toBe('DEU');
    });

    it('should handle mixed case', () => {
      expect(normalizeCountry('uNiTeD sTaTeS')).toBe('USA');
    });
  });

  describe('ISO alpha-3 passthrough', () => {
    it('should pass through valid ISO alpha-3 codes', () => {
      expect(normalizeCountry('USA')).toBe('USA');
      expect(normalizeCountry('gbr')).toBe('GBR');
      expect(normalizeCountry('Jpn')).toBe('JPN');
    });
  });

  describe('whitespace handling', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(normalizeCountry('  Brazil  ')).toBe('BRA');
    });
  });

  describe('fuzzy matching', () => {
    it('should fuzzy match close misspellings', () => {
      expect(normalizeCountry('Germny')).toBe('DEU');
    });

    it('should fuzzy match "Brazl" to BRA', () => {
      expect(normalizeCountry('Brazl')).toBe('BRA');
    });
  });

  describe('edge cases', () => {
    it('should return null for empty string', () => {
      expect(normalizeCountry('')).toBeNull();
    });

    it('should return null for whitespace-only string', () => {
      expect(normalizeCountry('   ')).toBeNull();
    });

    it('should return null for completely unknown input', () => {
      expect(normalizeCountry('Atlantis')).toBeNull();
    });

    it('should return null for null-like input', () => {
      expect(normalizeCountry(null as unknown as string)).toBeNull();
      expect(normalizeCountry(undefined as unknown as string)).toBeNull();
    });
  });
});
