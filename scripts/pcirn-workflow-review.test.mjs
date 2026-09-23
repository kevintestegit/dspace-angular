import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const decorator = await readFile(new URL('../src/app/shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator.ts', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/app/shared/mydspace-actions/claimed-task/delete/claimed-task-actions-delete.component.ts', import.meta.url), 'utf8');
const template = await readFile(new URL('../src/app/shared/mydspace-actions/claimed-task/delete/claimed-task-actions-delete.component.html', import.meta.url), 'utf8');
const ptBr = await readFile(new URL('../src/assets/i18n/pt-BR.json5', import.meta.url), 'utf8');

test('the delete option is registered for the claimed task loader', () => {
  assert.match(component, /export const WORKFLOW_TASK_OPTION_DELETE = 'submit_delete'/);
  assert.match(decorator, /WORKFLOW_TASK_OPTION_DELETE/);
  assert.match(decorator, /\[WORKFLOW_TASK_OPTION_DELETE, ClaimedTaskActionsDeleteComponent\]/);
  assert.match(decorator, /typeof ClaimedTaskActionsDeleteComponent/);
});

test('the delete action is a confirmed destructive option', () => {
  assert.match(component, /export class ClaimedTaskActionsDeleteComponent/);
  assert.match(component, /openDeleteModal\(content: any\)/);
  assert.match(template, /btn btn-danger/);
  assert.match(template, /delete\.confirm\.info/);
  assert.match(template, /delete\.confirm\.submit/);
});

test('the reviewer vocabulary names the four NUGECID decisions', () => {
  assert.match(ptBr, /"submission\.workflow\.tasks\.claimed\.approve": "Validar"/);
  assert.match(ptBr, /"submission\.workflow\.tasks\.claimed\.edit": "Editar"/);
  assert.match(ptBr, /"submission\.workflow\.tasks\.claimed\.reject\.submit": "Retornar ao setor"/);
  assert.match(ptBr, /"submission\.workflow\.tasks\.claimed\.delete": "Excluir item"/);
});
