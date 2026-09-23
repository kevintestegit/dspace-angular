import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

const [searchStyles, truncatableComponent, cardTemplate, cardComponent, eagerThemes, typeBadgeTemplate, typeBadgeComponent] = await Promise.all([
  read('../src/themes/custom/styles/_pcirn-search.scss'),
  read('../src/app/shared/truncatable/truncatable.component.ts'),
  read('../src/themes/custom/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.html'),
  read('../src/themes/custom/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.ts'),
  read('../src/themes/eager-themes.module.ts'),
  read('../src/themes/custom/app/shared/object-collection/shared/badges/type-badge/type-badge.component.html'),
  read('../src/themes/custom/app/shared/object-collection/shared/badges/type-badge/type-badge.component.ts'),
]);

function block(styles, selector) {
  const match = styles.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`));
  assert.ok(match, `expected a rule for ${selector}`);
  return match[1];
}

test('search card abstract is not clamped by the theme wrapper', () => {
  const abstract = block(searchStyles, "li[data-test='list-object'] .item-list-abstract");
  assert.doesNotMatch(abstract, /-webkit-line-clamp/);
  assert.doesNotMatch(abstract, /-webkit-box/);
  assert.doesNotMatch(abstract, /overflow:\s*hidden/);
});

test('only the last overflowing truncatable shows the toggle', () => {
  assert.match(truncatableComponent, /scrollHeight > element\.clientHeight/);
  assert.doesNotMatch(truncatableComponent, /classList\.add\('truncated'\)/);
  assert.doesNotMatch(truncatableComponent, /notruncatable/);
});

test('search card shows the publication date next to the label', () => {
  assert.match(cardTemplate, /item-list-date/);
  assert.match(cardTemplate, /firstMetadataValue\('dc\.date\.issued'\) \| date:'dd\/MM\/yyyy':'UTC'/);
  assert.match(cardComponent, /DatePipe/);
  assert.match(block(searchStyles, "li[data-test='list-object'] .item-list-date"), /font-weight/);
  assert.match(eagerThemes, /from '\.\/custom\/eager-theme\.module'/);
  assert.match(eagerThemes, /CustomEagerThemeModule/);
});

test('card badge shows the document type from dc.type', () => {
  assert.match(typeBadgeTemplate, /documentType/);
  assert.match(typeBadgeComponent, /firstMetadataValue\('dc\.type'\)/);
  assert.match(typeBadgeComponent, /templateUrl: '\.\/type-badge\.component\.html'/);
});
