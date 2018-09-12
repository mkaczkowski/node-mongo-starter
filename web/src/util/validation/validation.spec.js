import { number, required, integer } from './validation';

describe('Validators', () => {
  describe('required', () => {
    it('should pass', () => {
      const value = 'test';
      const result = required(value);
      expect(result).toBeUndefined();
    });

    it('should fail with empty value', () => {
      const value = '';
      const result = required(value);
      expect(result).toEqual('Field is required');
    });
  });

  describe('number', () => {
    it('should pass', () => {
      const value = 0;
      const result = number(value);
      expect(result).toBeUndefined();
    });

    it('should fail with invalid value', () => {
      const value = 'test';
      const result = number(value);
      expect(result).toEqual('Invalid number');
    });
  });

  describe('integer', () => {
    it('should pass', () => {
      const value = 0;
      const result = integer(value);
      expect(result).toBeUndefined();
    });

    it('should pass', () => {
      const value = 12321;
      const result = integer(value);
      expect(result).toBeUndefined();
    });

    it('should fail with negative value', () => {
      const value = -3213;
      const result = integer(value);
      expect(result).toEqual('Invalid number');
    });

    it('should fail with decimal value', () => {
      const value = 3213.33;
      const result = integer(value);
      expect(result).toEqual('Invalid number');
    });

    it('should fail with invalid value', () => {
      const value = 'test';
      const result = number(value);
      expect(result).toEqual('Invalid number');
    });
  });
});
