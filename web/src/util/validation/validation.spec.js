import { number, required } from './validation';

describe('Validators', () => {
  describe('required', () => {
    it('should pass', () => {
      const value = 'test';
      const result = required()(value);
      expect(result).toBeUndefined();
    });

    it('should fail with empty value', () => {
      const value = '';
      const result = required()(value);
      expect(result).toEqual('Required');
    });
  });

  describe('number', () => {
    it('should pass', () => {
      const value = 0;
      const result = number()(value);
      expect(result).toBeUndefined();
    });

    it('should fail with invalid value', () => {
      const value = 'test';
      const result = number()(value);
      expect(result).toEqual('Is not a number');
    });
  });
});
