import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const themeStyles = await readFile(new URL('../src/themes/custom/styles/_global-styles.scss', import.meta.url), 'utf8');
const registryStyles = await readFile(new URL('../src/themes/custom/styles/_pcirn-admin.scss', import.meta.url), 'utf8');
const epersonForm = await readFile(new URL('../src/app/access-control/epeople-registry/eperson-form/eperson-form.component.html', import.meta.url), 'utf8');
const epersonComponent = await readFile(new URL('../src/app/access-control/epeople-registry/eperson-form/eperson-form.component.ts', import.meta.url), 'utf8');
const ptBrTranslations = await readFile(new URL('../src/assets/i18n/pt-BR.json5', import.meta.url), 'utf8');
const enTranslations = await readFile(new URL('../src/assets/i18n/en.json5', import.meta.url), 'utf8');

test('PCIRN admin styles cover registries, forms, and membership sections', () => {
  assert.match(themeStyles, /@import '\.\/\_pcirn-admin\.scss';/);
  for (const selector of ['.epeople-registry', '.groups-registry', '.eperson-form', '.group-form', '.pcirn-administrator-control', 'ds-members-list', 'ds-subgroups-list']) {
    assert.ok(registryStyles.includes(selector), `admin styles should include ${selector}`);
  }
  assert.match(epersonForm, /class="eperson-form row"/);
});

test('EPerson edit exposes direct group membership and administrator guidance', () => {
  assert.match(epersonForm, /pcirn-group-access-management/);
  assert.match(epersonForm, /pcirn-administrator-control/);
  assert.match(epersonComponent, /addGroupToEPerson/);
  assert.match(epersonComponent, /removeGroupFromEPerson/);
  assert.match(epersonComponent, /addMemberToGroup/);
  assert.match(epersonComponent, /deleteMemberFromGroup/);
  for (const translations of [ptBrTranslations, enTranslations]) {
    assert.match(translations, /groupManagement\.administrator\.description/);
    assert.match(translations, /groupManagement\.notification\.added\.success/);
  }
});

test('EPerson edit exposes a direct administrator control with revoke confirmation', () => {
  assert.match(epersonForm, /pcirn-administrator-control/);
  assert.ok(epersonForm.indexOf('pcirn-administrator-control') < epersonForm.indexOf('<ds-form'));
  assert.match(epersonForm, /toggleAdministratorAccess/);
  assert.match(epersonComponent, /confirmAdministratorAccessRemoval/);
  assert.match(epersonComponent, /groupManagement\.administrator\.confirmRemoval/);
  for (const translations of [ptBrTranslations, enTranslations]) {
    assert.match(translations, /groupManagement\.administrator\.grant/);
    assert.match(translations, /groupManagement\.administrator\.revoke/);
    assert.match(translations, /groupManagement\.administrator\.confirmRemoval/);
  }
});

test('item publication editor keeps comfortable spacing above the footer for action buttons', async () => {
  const missingPagesStyles = await readFile(new URL('../src/themes/custom/styles/_pcirn-admin-missing-pages.scss', import.meta.url), 'utf8');
  const editItemPage = await readFile(new URL('../src/app/item-page/edit-item-page/edit-item-page.component.html', import.meta.url), 'utf8');
  const itemBitstreams = await readFile(new URL('../src/app/item-page/edit-item-page/item-bitstreams/item-bitstreams.component.html', import.meta.url), 'utf8');
  const itemCurate = await readFile(new URL('../src/app/item-page/edit-item-page/item-curate/item-curate.component.html', import.meta.url), 'utf8');
  const itemMove = await readFile(new URL('../src/app/item-page/edit-item-page/item-move/item-move.component.html', import.meta.url), 'utf8');
  const itemDelete = await readFile(new URL('../src/app/item-page/edit-item-page/item-delete/item-delete.component.html', import.meta.url), 'utf8');

  assert.match(missingPagesStyles, /ds-edit-item-page\s*\{[\s\S]*margin-bottom:[\s\S]*padding-bottom:/);
  assert.match(missingPagesStyles, /ds-item-move[\s\S]*margin-bottom:[\s\S]*padding-bottom:/);
  assert.match(editItemPage, /class="container mb-4"/);
  assert.match(editItemPage, /class="button-row bottom mb-4"/);
  assert.match(itemBitstreams, /class="button-row bottom mb-3"/);
  assert.match(itemCurate, /class="container mt-3 mb-5 pb-4"/);
  assert.match(itemMove, /class="container mb-5 pb-4"/);
  assert.match(itemMove, /class="button-row bottom mb-4"/);
  assert.match(itemDelete, /class="container mb-5 pb-4"/);
  assert.match(itemDelete, /class="space-children-mr mb-4"/);
});
