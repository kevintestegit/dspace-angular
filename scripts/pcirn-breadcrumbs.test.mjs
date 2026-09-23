import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const component = await readFile(new URL('../src/themes/custom/app/breadcrumbs/breadcrumbs.component.ts', import.meta.url), 'utf8');
const template = await readFile(new URL('../src/themes/custom/app/breadcrumbs/breadcrumbs.component.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/themes/custom/app/breadcrumbs/breadcrumbs.component.scss', import.meta.url), 'utf8');
const searchStyles = await readFile(new URL('../src/themes/custom/styles/_pcirn-search.scss', import.meta.url), 'utf8');

test('breadcrumb aligns with the content rail of each page family', () => {
  assert.match(component, /get pcirnSurface\(\): string/);
  assert.match(component, /\^\\\/items\\\/\[\^\/\]\+/);
  assert.match(component, /pcirn-breadcrumb--item/);
  assert.match(component, /pcirn-breadcrumb--list/);
  assert.match(component, /pcirn-breadcrumb--search/);
  assert.match(template, /class="pcirn-breadcrumb" \[ngClass\]="pcirnSurface"/);
});

test('breadcrumb rails mirror the community/collection list and search containers', () => {
  assert.match(styles, /\.pcirn-breadcrumb--list \.breadcrumb,\s*\.pcirn-breadcrumb--search \.breadcrumb\s*\{[^}]*max-width:\s*calc\(1150px \+ 2 \* clamp\(1rem, 4vw, 3\.75rem\)\)[^}]*padding-inline:\s*clamp\(1rem, 4vw, 3\.75rem\)/);
  assert.match(searchStyles, /ds-page-with-sidebar > \.container\s*\{[^}]*max-width:\s*calc\(1150px \+ 2 \* clamp\(1rem, 4vw, 3\.75rem\)\)/);
});

test('breadcrumb rails mirror the item document container', () => {
  assert.match(styles, /\.pcirn-breadcrumb--item \.breadcrumb\s*\{[^}]*max-width:\s*calc\(90\.625rem \+ 4rem\)[^}]*padding-inline:\s*2rem/);
});

test('default breadcrumb keeps the bootstrap container gutter', () => {
  assert.match(styles, /\.pcirn-breadcrumb \.breadcrumb\s*\{[\s\S]*?padding:\s*\.35rem \.75rem/);
});

test('breadcrumb items and separator share one vertical center', () => {
  assert.match(styles, /\.pcirn-breadcrumb \.breadcrumb-item\s*\{\s*align-items:\s*center;/);
});

test('breadcrumb labels ellipsize instead of clipping mid-word', () => {
  assert.match(styles, /\.pcirn-breadcrumb \.breadcrumb-item-limiter > a > span,[\s\S]*?text-overflow:\s*ellipsis;[\s\S]*?white-space:\s*nowrap;/);
  assert.match(styles, /\.pcirn-breadcrumb \.breadcrumb-item:first-child \{\s*flex-shrink:\s*0;/);
});

test('collection results keep their text card inside the mobile viewport', () => {
  assert.match(searchStyles, /#search-content li\[data-test='list-object'\] \.row > \[class\*='col-'\] \{[\s\S]*?width:\s*100%;[\s\S]*?max-width:\s*100%;[\s\S]*?margin-left:\s*0;/);
});
