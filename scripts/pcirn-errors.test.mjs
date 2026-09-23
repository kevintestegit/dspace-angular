import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const notFoundHtml = readFileSync(
  new URL('../src/themes/custom/app/pagenotfound/pagenotfound.component.html', import.meta.url),
  'utf8',
);

const forbiddenHtml = readFileSync(
  new URL('../src/themes/custom/app/forbidden/forbidden.component.html', import.meta.url),
  'utf8',
);

const notFoundTs = readFileSync(
  new URL('../src/themes/custom/app/pagenotfound/pagenotfound.component.ts', import.meta.url),
  'utf8',
);

const forbiddenTs = readFileSync(
  new URL('../src/themes/custom/app/forbidden/forbidden.component.ts', import.meta.url),
  'utf8',
);

const internalErrorHtml = readFileSync(
  new URL('../src/themes/custom/app/page-internal-server-error/page-internal-server-error.component.html', import.meta.url),
  'utf8',
);

const internalErrorScss = readFileSync(
  new URL('../src/themes/custom/app/page-internal-server-error/page-internal-server-error.component.scss', import.meta.url),
  'utf8',
);

const internalErrorTs = readFileSync(
  new URL('../src/themes/custom/app/page-internal-server-error/page-internal-server-error.component.ts', import.meta.url),
  'utf8',
);

const pageErrorHtml = readFileSync(
  new URL('../src/themes/custom/app/page-error/page-error.component.html', import.meta.url),
  'utf8',
);

const pageErrorTs = readFileSync(
  new URL('../src/themes/custom/app/page-error/page-error.component.ts', import.meta.url),
  'utf8',
);

const globalStyles = readFileSync(
  new URL('../src/themes/custom/styles/_global-styles.scss', import.meta.url),
  'utf8',
);

test('404 page has styled PCIRN error card with navigation shortcuts', () => {
  assert.match(notFoundHtml, /pcirn-error-card/);
  assert.match(notFoundHtml, /pcirn-error-actions/);
  assert.match(notFoundHtml, /routerLink="\/home"/);
  assert.match(notFoundHtml, /routerLink="\/search"/);
  assert.match(notFoundHtml, /routerLink="\/info\/fale-conosco"/);
  assert.match(notFoundHtml, /404/);
  assert.ok(notFoundHtml.trim().length > 100, '404 template must not be empty');
});

test('403 page has styled PCIRN error card with navigation shortcuts', () => {
  assert.match(forbiddenHtml, /pcirn-error-card/);
  assert.match(forbiddenHtml, /pcirn-error-actions/);
  assert.match(forbiddenHtml, /routerLink="\/home"/);
  assert.match(forbiddenHtml, /routerLink="\/search"/);
  assert.match(forbiddenHtml, /routerLink="\/info\/fale-conosco"/);
  assert.match(forbiddenHtml, /403/);
  assert.ok(forbiddenHtml.trim().length > 100, '403 template must not be empty');
});

test('404 component uses its own themed template', () => {
  assert.match(notFoundTs, /templateUrl:\s*['"].\//);
  assert.doesNotMatch(notFoundTs, /templateUrl:.*\.\.\/.*\.\.\/.*pagenotfound/);
});

test('403 component uses its own themed template', () => {
  assert.match(forbiddenTs, /templateUrl:\s*['"].\//);
  assert.doesNotMatch(forbiddenTs, /templateUrl:.*\.\.\/.*\.\.\/.*forbidden/);
});

test('500 page displays "fora do ar" and "tente novamente em alguns instantes"', () => {
  assert.match(internalErrorHtml, /fora do ar/i);
  assert.match(internalErrorHtml, /tente novamente em alguns instantes/i);
  assert.match(internalErrorHtml, /500/);
});

test('500 page displays marks of PCIRN, DSpace and RN state crest', () => {
  assert.match(internalErrorHtml, /brasao-policia-cientifica-rn\.png/);
  assert.match(internalErrorHtml, /dspace-logo-mini\.svg/);
  assert.match(internalErrorHtml, /brasao-estado-rn\.png/);
});

test('500 page includes reload action and home link', () => {
  assert.match(internalErrorHtml, /\(click\)="reload\(\)"/);
  assert.match(internalErrorHtml, /routerLink="\/home"/);
  assert.match(internalErrorTs, /reload\(\)/);
});

test('500 page hides header and footer for standalone offline view', () => {
  // Fullscreen overlay in component SCSS
  assert.match(internalErrorScss, /position:\s*fixed/);
  assert.match(internalErrorScss, /z-index:\s*99999/);
  // Component manages body class
  assert.match(internalErrorTs, /classList\.add\('pcirn-offline-mode'\)/);
  assert.match(internalErrorTs, /classList\.remove\('pcirn-offline-mode'\)/);
  // Global hiding rules for header, breadcrumbs, and footer
  assert.match(globalStyles, /body\.pcirn-offline-mode/);
  assert.match(globalStyles, /ds-footer/);
  assert.match(globalStyles, /display:\s*none !important/);
});

test('500 component uses its own themed template', () => {
  assert.match(internalErrorTs, /templateUrl:\s*['"].\//);
  assert.doesNotMatch(internalErrorTs, /templateUrl:.*\.\.\/.*\.\.\/.*page-internal-server-error/);
});

test('generic error page has styled PCIRN error card with navigation shortcuts', () => {
  assert.match(pageErrorHtml, /pcirn-error-card/);
  assert.match(pageErrorHtml, /pcirn-error-actions/);
  assert.match(pageErrorHtml, /routerLink="\/home"/);
  assert.match(pageErrorHtml, /routerLink="\/search"/);
  assert.match(pageErrorHtml, /routerLink="\/info\/fale-conosco"/);
  assert.ok(pageErrorHtml.trim().length > 100, 'generic error template must not be empty');
});

test('generic error component uses its own themed template', () => {
  assert.match(pageErrorTs, /templateUrl:\s*['"].\//);
  assert.doesNotMatch(pageErrorTs, /templateUrl:.*\.\.\/.*\.\.\/.*page-error/);
});
