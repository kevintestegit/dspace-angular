import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const privacyHtml = readFileSync(
  new URL('../src/themes/custom/app/info/privacy/privacy.component.html', import.meta.url),
  'utf8',
);

const agreementHtml = readFileSync(
  new URL('../src/themes/custom/app/info/end-user-agreement/end-user-agreement.component.html', import.meta.url),
  'utf8',
);

const privacyTs = readFileSync(
  new URL('../src/themes/custom/app/info/privacy/privacy.component.ts', import.meta.url),
  'utf8',
);

const agreementTs = readFileSync(
  new URL('../src/themes/custom/app/info/end-user-agreement/end-user-agreement.component.ts', import.meta.url),
  'utf8',
);

test('privacy page does not contain English corporate placeholder text', () => {
  assert.doesNotMatch(privacyHtml, /Children under the age of 13/);
  assert.doesNotMatch(privacyHtml, /"Company" or "We"/);
  assert.doesNotMatch(privacyHtml, /Last updated May/);
});

test('privacy page contains LGPD and PCIRN institutional content', () => {
  assert.match(privacyHtml, /LGPD/);
  assert.match(privacyHtml, /Lei.*13\.709/);
  assert.match(privacyHtml, /NUGECID/);
  assert.match(privacyHtml, /pcirn-about-card/);
  assert.match(privacyHtml, /pcirn-about-section/);
  assert.doesNotMatch(privacyHtml, /\.\.\./);
});

test('privacy component uses its own template, not the base', () => {
  assert.match(privacyTs, /templateUrl:\s*['"].\//); // local path starting with ./
  assert.doesNotMatch(privacyTs, /templateUrl:.*\.\.\/.*\.\.\/.*privacy/);
});

test('end-user-agreement does not contain broken footnote links or ellipsis placeholders', () => {
  assert.doesNotMatch(agreementHtml, /fragment="comment-a"/);
  assert.doesNotMatch(agreementHtml, /\[a\]/);
  assert.doesNotMatch(agreementHtml, /\.\.\./);
});

test('end-user-agreement contains PCIRN institutional terms', () => {
  assert.match(agreementHtml, /pcirn-about-card/);
  assert.match(agreementHtml, /pcirn-about-section/);
  assert.match(agreementHtml, /Repositório Institucional/);
  assert.match(agreementHtml, /Polícia Científica/);
  assert.match(agreementHtml, /NUGECID/);
  assert.match(agreementHtml, /12\.527/);
  assert.match(agreementHtml, /submit\(\)/);
});

test('end-user-agreement component uses its own template, not the base', () => {
  assert.match(agreementTs, /templateUrl:\s*['"].\//); // local path starting with ./
  assert.doesNotMatch(agreementTs, /templateUrl:.*\.\.\/.*\.\.\/.*end-user-agreement/);
});
