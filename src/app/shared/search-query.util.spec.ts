import { normalizeSearchQuery } from './search-query.util';

describe('normalizeSearchQuery', () => {
  it('should leave an ordinary query untouched', () => {
    expect(normalizeSearchQuery('portaria identidade funcional')).toBe('portaria identidade funcional');
  });

  it('should keep a phrase with balanced quotes as it is', () => {
    expect(normalizeSearchQuery('"notas tecnicas"')).toBe('"notas tecnicas"');
  });

  it('should close an unmatched double quote instead of letting the API reject the query', () => {
    expect(normalizeSearchQuery('"notas tecnicas')).toBe('"notas tecnicas"');
  });

  it('should collapse runs of wildcards', () => {
    expect(normalizeSearchQuery('operacao**')).toBe('operacao*');
    expect(normalizeSearchQuery('operacao***')).toBe('operacao*');
  });

  it('should not rewrite a percent sign, which is more likely to be literal', () => {
    expect(normalizeSearchQuery('100%')).toBe('100%');
    expect(normalizeSearchQuery('operacao%')).toBe('operacao%');
  });

  it('should return empty or missing values as they came', () => {
    expect(normalizeSearchQuery('')).toBe('');
    expect(normalizeSearchQuery('   ')).toBe('   ');
    expect(normalizeSearchQuery(undefined)).toBeUndefined();
    expect(normalizeSearchQuery(null)).toBeNull();
  });
});
