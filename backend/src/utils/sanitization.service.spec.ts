import { SanitizationService } from './sanitization.service';

describe('SanitizationService', () => {
  let service: SanitizationService;

  beforeEach(() => {
    service = new SanitizationService();
  });

  it('should sanitize HTML input', () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = service.sanitizeInput(input);
    expect(result).toBe('Hello');
  });

  it('should sanitize SQL input', () => {
    const input = "'; DROP TABLE users; --";
    const result = service.sanitizeInput(input);
    expect(result).not.toContain('DROP TABLE');
  });

  it('should validate email format', () => {
    expect(service.validateEmail('test@example.com')).toBe(true);
    expect(service.validateEmail('invalid-email')).toBe(false);
  });

  it('should validate phone format', () => {
    expect(service.validatePhone('+1234567890')).toBe(true);
    expect(service.validatePhone('invalid')).toBe(false);
  });
});