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
