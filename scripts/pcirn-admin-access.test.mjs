import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const template = await readFile(new URL('../src/themes/custom/app/admin/admin-dashboard/admin-dashboard.component.html', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/themes/custom/app/admin/admin-dashboard/admin-dashboard.component.ts', import.meta.url), 'utf8');
const appRoutes = await readFile(new URL('../src/app/app-routes.ts', import.meta.url), 'utf8');
const accessRoutes = await readFile(new URL('../src/app/access-control/access-control-routes.ts', import.meta.url), 'utf8');
const ptBrTranslations = await readFile(new URL('../src/assets/i18n/pt-BR.json5', import.meta.url), 'utf8');
const enTranslations = await readFile(new URL('../src/assets/i18n/en.json5', import.meta.url), 'utf8');

test('admin dashboard links to account and group management', () => {
  assert.ok(/pcirn-admin-account-access/.test(template), 'dashboard must expose the account access section');
  assert.ok(/\[routerLink\]="userRegistryRoute"/.test(template), 'dashboard must link to user accounts');
  assert.ok(/\[routerLink\]="groupRegistryRoute"/.test(template), 'dashboard must link to groups');
  assert.ok(/getEPersonsRoute/.test(component), 'account route must use the DSpace route helper');
  assert.ok(/getGroupsRoute/.test(component), 'group route must use the DSpace route helper');
});

test('account and group management remain restricted to authorized administrators', () => {
  const adminRoute = appRoutes.match(/path: ADMIN_MODULE_PATH,[\s\S]*?canActivate: \[siteAdministratorGuard/);
  assert.ok(adminRoute, 'admin route must require site administrator permissions');
  assert.ok(/path: EPERSON_PATH,[\s\S]*?canActivate: \[siteAdministratorGuard\]/.test(accessRoutes), 'account registry must require site admin');
  assert.ok(/path: GROUP_PATH,[\s\S]*?canActivate: \[groupAdministratorGuard\]/.test(accessRoutes), 'group registry must require group admin');
});

test('admin account access instructions are translated in Portuguese and English', () => {
  assert.ok(/"pcirn-admin\.users\.description"/.test(ptBrTranslations), 'Portuguese instructions are required');
  assert.ok(/"pcirn-admin\.users\.description"/.test(enTranslations), 'English instructions are required');
});
