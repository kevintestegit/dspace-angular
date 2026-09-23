import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const loginHtml = readFileSync(
  new URL('../src/themes/custom/app/login-page/login-page.component.html', import.meta.url),
  'utf8',
);

const loginScss = readFileSync(
  new URL('../src/themes/custom/app/login-page/login-page.component.scss', import.meta.url),
  'utf8',
);

const loginTs = readFileSync(
  new URL('../src/themes/custom/app/login-page/login-page.component.ts', import.meta.url),
  'utf8',
);

const logoutHtml = readFileSync(
  new URL('../src/themes/custom/app/logout-page/logout-page.component.html', import.meta.url),
  'utf8',
);

const logoutScss = readFileSync(
  new URL('../src/themes/custom/app/logout-page/logout-page.component.scss', import.meta.url),
  'utf8',
);

const logoutTs = readFileSync(
  new URL('../src/themes/custom/app/logout-page/logout-page.component.ts', import.meta.url),
  'utf8',
);

const customGlobalStyles = readFileSync(
  new URL('../src/themes/custom/styles/_global-styles.scss', import.meta.url),
  'utf8',
);

test('login-page template does not reference dspace-logo.svg', () => {
  assert.doesNotMatch(loginHtml, /dspace-logo\.svg/);
});

test('login-page template references brasao-policia-cientifica-rn.png', () => {
  assert.match(loginHtml, /brasao-policia-cientifica-rn\.png/);
});

test('login-page template contains pcirn-login-card, ds-log-in and home link', () => {
  assert.match(loginHtml, /pcirn-login-card/);
  assert.match(loginHtml, /ds-log-in/);
  assert.match(loginHtml, /routerLink="\/home"/);
});

test('login-page component uses its own themed template and styles', () => {
  assert.match(loginTs, /templateUrl:\s*['"]\.\/login-page\.component\.html['"]/);
  assert.match(loginTs, /styleUrls:\s*\[['"]\.\/login-page\.component\.scss['"]\]/);
  assert.doesNotMatch(loginTs, /templateUrl:.*\.\.\/.*\.\.\/.*login-page/);
});

test('logout-page template does not reference dspace-logo.svg', () => {
  assert.doesNotMatch(logoutHtml, /dspace-logo\.svg/);
});

test('logout-page template references brasao-policia-cientifica-rn.png', () => {
  assert.match(logoutHtml, /brasao-policia-cientifica-rn\.png/);
});

test('logout-page template contains pcirn-login-card, ds-log-out and home link', () => {
  assert.match(logoutHtml, /pcirn-login-card/);
  assert.match(logoutHtml, /ds-log-out/);
  assert.match(logoutHtml, /routerLink="\/home"/);
});

test('logout-page component uses its own themed template and styles', () => {
  assert.match(logoutTs, /templateUrl:\s*['"]\.\/logout-page\.component\.html['"]/);
  assert.match(logoutTs, /styleUrls:\s*\[['"]\.\/logout-page\.component\.scss['"]\]/);
  assert.doesNotMatch(logoutTs, /templateUrl:.*\.\.\/.*\.\.\/.*logout-page/);
});

test('login-page scss contains PCIRN theme styling', () => {
  assert.match(loginScss, /#07345f/);
  assert.match(loginScss, /\.pcirn-login-card/);
});

test('logout-page scss contains PCIRN theme styling', () => {
  assert.match(logoutScss, /#07345f/);
  assert.match(logoutScss, /\.pcirn-login-card/);
});

test('forgot and register pages keep breathing room under the header', () => {
  // Both routes render without breadcrumbs, so the shared e-mail forms must
  // carry the same top spacing the breadcrumb rail provides on other pages.
  assert.match(customGlobalStyles, /ds-forgot-email,\s*\n\s*ds-register-email,\s*\n\s*ds-forgot-password-form \{[\s\S]*?padding-top:\s*var\(--ds-content-spacing\)/);
});
