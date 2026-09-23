import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const themeStyles = await readFile(new URL('../src/themes/custom/styles/_global-styles.scss', import.meta.url), 'utf8');
const processStyles = await readFile(new URL('../src/themes/custom/styles/_pcirn-processes.scss', import.meta.url), 'utf8');
const adminStyles = await readFile(new URL('../src/themes/custom/styles/_pcirn-admin.scss', import.meta.url), 'utf8');
const overviewTemplate = await readFile(new URL('../src/app/process-page/overview/process-overview.component.html', import.meta.url), 'utf8');
const tableTemplate = await readFile(new URL('../src/app/process-page/overview/table/process-overview-table.component.html', import.meta.url), 'utf8');

test('PCIRN processes skin is part of the theme', () => {
  assert.match(themeStyles, /@import '\.\/\_pcirn-processes\.scss';/);
});

test('PCIRN processes skin styles the overview and section tables like the admin registries', () => {
  for (const selector of ['ds-process-overview', 'ds-process-overview-table', '.table-responsive', '.badge-nb-processes', '.pagination-info', 'ngb-pagination .page-link']) {
    assert.ok(processStyles.includes(selector), `processes styles should include ${selector}`);
  }
  // The skin must restyle the stock templates, not require template changes.
  assert.match(overviewTemplate, /ds-process-overview-table/);
  assert.match(tableTemplate, /table table-striped table-hover/);
  assert.match(tableTemplate, /badge-nb-processes/);
});

test('PCIRN processes skin shares the administration palette tokens', () => {
  // Declared in _pcirn-admin.scss and reused by the processes skin.
  assert.match(adminStyles, /\$pcirn-admin-ink: #0b3154;/);
  assert.match(adminStyles, /\$pcirn-admin-blue: #0e5a73;/);
  assert.match(processStyles, /\$pcirn-admin-ink/);
  assert.match(processStyles, /\$pcirn-admin-blue/);
  assert.match(processStyles, /\$pcirn-admin-border/);
});
