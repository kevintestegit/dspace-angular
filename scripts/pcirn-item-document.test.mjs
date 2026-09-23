import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const themeDir = join(scriptDir, '..', 'src', 'themes', 'custom', 'app');

function read(...parts) {
  return readFileSync(join(themeDir, ...parts), 'utf8');
}

test('public document item types use the shared PCIRN shell', () => {
  const shell = read('item-page', 'pcirn-document-item', 'pcirn-document-item.component.html');
  const untyped = read('item-page', 'simple', 'item-types', 'untyped-item', 'untyped-item.component.html');
  const publication = read('item-page', 'simple', 'item-types', 'publication', 'publication.component.html');

  assert.match(shell, /pcirn-document-shell/);
  assert.match(shell, /ds-item-page-file-section/);
  assert.match(shell, /dc\.description\.abstract/);
  assert.match(shell, /dc\.subject/);
  assert.match(shell, /dc\.identifier\.uri/);
  assert.match(shell, /dc\.identifier\.citation/);
  assert.match(shell, /@if\s*\(documentType;\s*as type\)/);
  assert.match(shell, /@if\s*\(citation;\s*as citationValue\)/);
  assert.doesNotMatch(shell, /25fa6a40-d9ad-4eb5-9bf6-e37907cffb5c|20\.500\.12345\/7890|Portaria nº 196\/2023/);
  assert.match(untyped, /ds-pcirn-document-item/);
  assert.match(publication, /ds-pcirn-document-item/);
});

test('full public item view keeps the full metadata table inside the shared shell', () => {
  const fullPage = read('item-page', 'full', 'full-item-page.component.html');

  assert.match(fullPage, /ds-pcirn-document-item/);
  assert.match(fullPage, /fullView/);
  assert.match(fullPage, /metadata\$\s*\|\s*async\)\s*\|\s*keyvalue/);
  assert.match(fullPage, /ds-item-page-full-file-section/);
  assert.match(fullPage, /ds-item-page-collections/);
});

test('full metadata displays translated labels for PCIRN metadata fields', () => {
  const shell = read('item-page', 'pcirn-document-item', 'pcirn-document-item.component.html');
  const component = read('item-page', 'pcirn-document-item', 'pcirn-document-item.component.ts');
  const portuguese = readFileSync(join(scriptDir, '..', 'src', 'assets', 'i18n', 'pt-BR.json5'), 'utf8');
  const english = readFileSync(join(scriptDir, '..', 'src', 'assets', 'i18n', 'en.json5'), 'utf8');
  const metadataKeys = [
    'dc.contributor.author',
    'dc.coverage.temporal',
    'dc.date.accessioned',
    'dc.date.issued',
    'dc.description.abstract',
    'dc.description.provenance',
    'dc.format.extent',
    'dc.identifier.other',
    'dc.identifier.uri',
    'dc.language',
    'dc.publisher',
    'dc.rights',
    'dc.source',
    'dc.subject',
    'dc.title',
    'dc.type',
  ];

  assert.match(shell, /metadataLabelKey\(entry\.key\)/);
  assert.match(component, /PCIRN_METADATA_LABEL_KEYS/);
  for (const key of metadataKeys) {
    assert.ok(portuguese.includes(`"pcirn.item.metadata.${key}"`), `Missing pt-BR label for ${key}`);
    assert.ok(english.includes(`"pcirn.item.metadata.${key}"`), `Missing English label for ${key}`);
  }
});

test('item metadata editor displays the same translated labels', () => {
  const editorTemplate = readFileSync(join(scriptDir, '..', 'src', 'app', 'dso-shared', 'dso-edit-metadata', 'dso-edit-metadata.component.html'), 'utf8');
  const editorComponent = readFileSync(join(scriptDir, '..', 'src', 'app', 'dso-shared', 'dso-edit-metadata', 'dso-edit-metadata.component.ts'), 'utf8');

  assert.match(editorTemplate, /metadataLabelKey\(mdField\)/);
  assert.match(editorComponent, /pcirn\.item\.metadata\./);
  assert.match(editorComponent, /dsoType !== 'item'/);
});

test('custom item status screen groups information and actions into clear sections', () => {
  const statusTemplate = read('item-page', 'edit-item-page', 'item-status', 'item-status.component.html');
  const statusStyles = read('item-page', 'edit-item-page', 'item-status', 'item-status.component.scss');

  assert.match(statusTemplate, /pcirn-status-intro/);
  assert.match(statusTemplate, /pcirn-status-details/);
  assert.match(statusTemplate, /pcirn-status-actions/);
  assert.match(statusTemplate, /<ds-item-operation/);
  assert.match(statusStyles, /pcirn-status-details/);
});

test('file section opens documents in the browser viewer instead of forcing a download', () => {
  const fileSection = read('item-page', 'simple', 'field-components', 'file-section', 'file-section.component.html');

  assert.match(fileSection, /\[isBlank\]="true"/);
  assert.match(fileSection, /pcirn\.item\.view/);
  assert.doesNotMatch(fileSection, /item\.page\.filesection\.download/);
  assert.doesNotMatch(fileSection, /dsFileSize|pcirn-document-download-size/);
});

test('custom header keeps only the existing functional DSpace controls', () => {
  const header = read('header', 'header.component.html');

  assert.match(header, /ds-search-navbar/);
  assert.match(header, /ds-lang-switch/);
  assert.match(header, /ds-auth-nav-menu/);
  assert.doesNotMatch(header, /routerLink\s*=|href\s*=/);
});
