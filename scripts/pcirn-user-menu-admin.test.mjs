import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const srcDir = join(scriptDir, '..', 'src');
const userMenuDir = join(srcDir, 'themes', 'custom', 'app', 'shared', 'auth-nav-menu', 'user-menu');

function read(...parts) {
  return readFileSync(join(...parts), 'utf8');
}

test('user menu builds the admin tree from MenuID.ADMIN without hanging', () => {
  const component = read(userMenuDir, 'user-menu.component.ts');

  assert.match(component, /MenuID\.ADMIN/);
  assert.match(component, /getMenuTopSections\(MenuID\.ADMIN\)/);
  assert.match(component, /getSubSectionsByParentID\(MenuID\.ADMIN, section\.id\)/);
  assert.match(component, /sections\.length === 0/);
});

test('user menu renders collapsible groups with links and actions', () => {
  const template = read(userMenuDir, 'user-menu.component.html');

  assert.match(template, /pcirn-user-menu-admin-list/);
  assert.match(template, /adminMenuOpen/);
  assert.match(template, /aria-expanded/);
  assert.match(template, /toggleAdminSection\(group\.section, \$event\)/);
  assert.match(template, /isAdminSectionExpanded\(group\.section\)/);
  assert.match(template, /executeAdminSection\(item\)/);
  assert.match(template, /\[routerLink\]="link"/);
  assert.match(template, /'admin\.dashboard\.title' \| translate/);
  assert.match(template, /adminMenuInstanceId/);
});

test('toggling a group does not close the dropdown and actions close it first', () => {
  const component = read(userMenuDir, 'user-menu.component.ts');

  assert.match(component, /toggleAdminSection\(section: MenuSection, event: Event\)[\s\S]*?event\.stopPropagation\(\)/);
  assert.match(component, /executeAdminSection\(section: MenuSection\)[\s\S]*?this\.onMenuItemClick\(\)[\s\S]*?\.function\(\)/);
});

test('menu service emits an empty list for sections without children', () => {
  const service = read(srcDir, 'app', 'shared', 'menu', 'menu.service.ts');

  assert.match(
    service,
    /switchMap\(\(ids: string\[\]\) => isNotEmpty\(ids\)\s*\?\s*observableCombineLatest\(ids\.map\(\(id: string\) => this\.getMenuSection\(menuID, id\)\)\)\s*:\s*of\(\[\]\),/,
  );
});

test('user menu styles cover the admin groups', () => {
  const styles = read(userMenuDir, 'user-menu.component.scss');

  assert.match(styles, /\.pcirn-user-menu-admin-list/);
  assert.match(styles, /\.pcirn-user-menu-admin-items/);
  assert.match(styles, /\.pcirn-user-menu-admin-group/);
});

test('user menu dropdown caps its height and scrolls as a single container', () => {
  const styles = read(userMenuDir, 'user-menu.component.scss');

  assert.match(styles, /&\.user-menu-dropdown[\s\S]*?max-height: calc\(100vh - 12rem\)[\s\S]*?overflow-y: auto/);
  assert.doesNotMatch(styles, /\.pcirn-user-menu-admin-list \{[\s\S]*?max-height/);
});
