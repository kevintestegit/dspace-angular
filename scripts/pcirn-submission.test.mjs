import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const themeDir = join(scriptDir, '..', 'src', 'themes', 'custom', 'app');
const stylesDir = join(scriptDir, '..', 'src', 'themes', 'custom', 'styles');

function read(...parts) {
  return readFileSync(join(themeDir, ...parts), 'utf8');
}

test('submission shell uses the custom templates instead of the base ones', () => {
  const edit = read('submission', 'edit', 'submission-edit.component.ts');
  const form = read('submission', 'form', 'submission-form.component.ts');
  const container = read('submission', 'sections', 'container', 'section-container.component.ts');
  const footer = read('submission', 'form', 'footer', 'submission-form-footer.component.ts');
  const uploadFile = read('submission', 'sections', 'upload', 'file', 'section-upload-file.component.ts');

  for (const component of [edit, form, container, footer, uploadFile]) {
    assert.match(component, /templateUrl: '\.\//);
    assert.doesNotMatch(component, /^\s*templateUrl: '\.\.\//m);
  }
});

test('submission edit page keeps the form contract and gets the PCIRN hero', () => {
  const template = read('submission', 'edit', 'submission-edit.component.html');

  assert.match(template, /pcirn-submission-hero/);
  assert.match(template, /'submission\.edit\.title' \| translate/);
  for (const binding of ['collectionId', 'sections', 'selfUrl', 'submissionDefinition', 'submissionErrors', 'item', 'collectionModifiable', 'submissionId']) {
    assert.match(template, new RegExp(`\\[${binding}\\]="${binding}"`));
  }
});

test('submission form keeps every native section binding', () => {
  const template = read('submission', 'form', 'submission-form.component.html');

  assert.match(template, /pcirn-submission-toolbar/);
  assert.match(template, /pcirn-submission-actions/);
  assert.match(template, /isLoading\$ \| async/);
  assert.match(template, /uploadEnabled\$ \| async/);
  assert.match(template, /submissionSections \| async/);
  assert.match(template, /ds-submission-upload-files/);
  assert.match(template, /ds-submission-form-collection/);
  assert.match(template, /ds-submission-form-section-add/);
  assert.match(template, /ds-submission-section-container/);
  assert.match(template, /ds-submission-form-footer/);
});

test('section accordion keeps status, removal and outlet behaviour', () => {
  const template = read('submission', 'sections', 'container', 'section-container.component.html');

  assert.match(template, /dsSection/);
  assert.match(template, /ngb-accordion/);
  assert.match(template, /sectionRef\.isEnabled\(\) \| async/);
  assert.match(template, /sectionRef\.isValid\(\) \| async/);
  assert.match(template, /sectionRef\.hasErrors\(\)/);
  assert.match(template, /removeSection\(\$event\)/);
  assert.match(template, /ngComponentOutlet/);
});

test('action bar keeps the deposit, save, save-later and discard hooks', () => {
  const template = read('submission', 'form', 'footer', 'submission-form-footer.component.html');

  assert.match(template, /pcirn-submission-actions-bar/);
  assert.match(template, /id="discard"/);
  assert.match(template, /id="save"/);
  assert.match(template, /id="saveForLater"/);
  assert.match(template, /id="deposit"/);
  assert.match(template, /\(click\)="deposit\(\$event\)"/);
  assert.match(template, /\(click\)="saveLater\(\$event\)"/);
  assert.match(template, /confirmDiscard\(content\)/);
  assert.match(template, /submission\.general\.discard\.confirm\.title/);
});

test('uploaded file row keeps the primary switch, view and actions', () => {
  const template = read('submission', 'sections', 'upload', 'file', 'section-upload-file.component.html');

  assert.match(template, /pcirn-submission-file/);
  assert.match(template, /togglePrimaryBitstream\(\$event\)/);
  assert.match(template, /ds-submission-section-upload-file-view/);
  assert.match(template, /ds-file-download-link/);
  assert.match(template, /editBitstreamData\(\)/);
  assert.match(template, /confirmDelete\(content\)/);
});

test('PCIRN submission stylesheet is imported and scoped', () => {
  const globalStyles = readFileSync(join(stylesDir, '_global-styles.scss'), 'utf8');
  const partial = readFileSync(join(stylesDir, '_pcirn-submission.scss'), 'utf8');

  assert.match(globalStyles, /@import '\.\/_pcirn-submission\.scss';/);
  assert.match(partial, /\.pcirn-submission \{/);
  assert.match(partial, /\.pcirn-submission-actions/);
  assert.match(partial, /ds-base-drop-zone/);
});
