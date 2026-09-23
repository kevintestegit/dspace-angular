import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

const [communityTemplate, collectionTemplate, styles, communityComponent, collectionComponent, ptBrTranslations, enTranslations] = await Promise.all([
  read('../src/themes/custom/app/community-list-page/community-list-page.component.html'),
  read('../src/themes/custom/app/collection-list-page/collection-list-page.component.html'),
  read('../src/themes/custom/styles/_pcirn-list.scss'),
  read('../src/themes/custom/app/community-list-page/community-list-page.component.ts'),
  read('../src/themes/custom/app/collection-list-page/collection-list-page.component.ts'),
  read('../src/assets/i18n/pt-BR.json5'),
  read('../src/assets/i18n/en.json5'),
]);

test('community list follows the approved flat card composition', () => {
  assert.match(communityTemplate, /pcirn-list/);
  assert.match(communityTemplate, /pcirn-list-search/);
  assert.match(communityTemplate, /communityList\.search/);
  assert.match(communityTemplate, /communityList\.count/);
  assert.match(communityTemplate, /pcirn-list-icon/);
  assert.match(communityTemplate, /pcirn-list-chevron/);
  assert.match(communityTemplate, /\['\/communities', card\.community\.id\]/);
  assert.doesNotMatch(communityTemplate, /ds-community-list/);
});

test('community list loads top communities and filters them locally', () => {
  assert.match(communityComponent, /communityDataService\.findTop/);
  assert.match(communityComponent, /shortDescription/);
  assert.match(communityComponent, /filterCommunityCards/);
  assert.match(communityComponent, /totalPages/);
});

test('collection list follows the approved flat card composition', () => {
  assert.match(collectionTemplate, /pcirn-list/);
  assert.match(collectionTemplate, /pcirn-list-search/);
  assert.match(collectionTemplate, /collectionList\.search/);
  assert.match(collectionTemplate, /collectionList\.count/);
  assert.match(collectionTemplate, /pcirn-list-icon/);
  assert.match(collectionTemplate, /pcirn-list-chevron/);
  assert.match(collectionTemplate, /pcirn-list-context/);
  assert.match(collectionTemplate, /card\.communityName/);
  assert.match(collectionTemplate, /\['\/collections', card\.collection\.id\]/);
  assert.doesNotMatch(collectionTemplate, /ds-collection-list-element/);
});

test('collection list loads all collections and filters them locally', () => {
  assert.match(collectionComponent, /collectionDataService\.findAll/);
  assert.match(collectionComponent, /communityDataService\.findByHref/);
  assert.match(collectionComponent, /parentCommunity/);
  assert.match(collectionComponent, /shortDescription/);
  assert.match(collectionComponent, /filterCollectionCards/);
  assert.match(collectionComponent, /totalPages/);
});

test('community and collection list copy exists in both languages', () => {
  assert.match(ptBrTranslations, /"communityList\.subtitle":\s*"Navegue pelas comunidades/);
  assert.match(ptBrTranslations, /"communityList\.search":\s*"Buscar comunidades\.\.\."/);
  assert.match(ptBrTranslations, /"communityList\.count":\s*"\{\{ count \}\} comunidades encontradas"/);
  assert.match(ptBrTranslations, /"communityList\.count\.one":\s*"\{\{ count \}\} comunidade encontrada"/);
  assert.match(ptBrTranslations, /"collectionList\.subtitle":\s*"Navegue pelas coleções/);
  assert.match(ptBrTranslations, /"collectionList\.search":\s*"Buscar coleções\.\.\."/);
  assert.match(ptBrTranslations, /"collectionList\.count":\s*"\{\{ count \}\} coleções encontradas"/);
  assert.match(ptBrTranslations, /"collectionList\.count\.one":\s*"\{\{ count \}\} coleção encontrada"/);
  assert.match(enTranslations, /"communityList\.search":\s*"Search communities\.\.\."/);
  assert.match(enTranslations, /"collectionList\.search":\s*"Search collections\.\.\."/);
  assert.match(enTranslations, /"collectionList\.count":\s*"\{\{ count \}\} collections found"/);
});

test('list surface keeps its responsive card layout', () => {
  assert.match(styles, /\.pcirn-list-cards/);
  assert.match(styles, /\.pcirn-list-toolbar/);
  assert.match(styles, /@media \(max-width: 700px\)/);
});
