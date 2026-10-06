import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const groups = JSON.parse(read('src/app/info/tutoriais/tutorials.catalog.ts').split(' = ')[1].replace(/;\s*$/, '').replaceAll("'", '"').replace(/,\s*([}\]])/g, '$1'));
const documents = groups.flatMap((group) => group.documents);

test('public tutorials link belongs to Navigation and its route has no login guard', () => {
  const footer = read('src/app/footer/footer.component.html');
  const navigation = footer.split("'pcirn.footer.nav.title'")[1].split('</div>')[0];
  assert.match(navigation, /routerLink="\/info\/tutoriais"/);
  assert.equal(footer.match(/routerLink="\/info\/tutoriais"/g).length, 1);
  const route = read('src/app/info/info-routes.ts').split('path: TUTORIAIS_PATH,')[1].split('},')[0];
  assert.match(route, /component: TutoriaisComponent/);
  assert.doesNotMatch(route, /canActivate/);
});

test('all five catalogue PDFs exist and their metadata match the exported files', () => {
  assert.equal(documents.length, 5);
  assert.equal(new Set(documents.map((document) => document.id)).size, 5);
  for (const document of documents) {
    const file = new URL(`src/assets/pcirn/tutoriais/${document.id}.pdf`, root);
    const buffer = readFileSync(file);
    assert.equal(buffer.subarray(0, 5).toString(), '%PDF-');
    assert.equal(document.size, `${Math.round(statSync(file).size / 1024)} KB`);
    const info = execFileSync('pdfinfo', [file.pathname], { encoding: 'utf8' });
    assert.equal(Number(info.match(/^Pages:\s+(\d+)/m)[1]), document.pages);
    assert.match(info, /^Tagged:\s+yes/m);
    const text = execFileSync('pdftotext', [file.pathname, '-'], { encoding: 'utf8' });
    assert.match(text, /NUGECID/);
    assert.match(text, /Versão 1\.0/);
    assert.doesNotMatch(text, /SIGAA|Orientadores|bibliotecário/i);
  }
});

test('catalogue entries have labels in Portuguese and English and announce the new tab', () => {
  for (const language of ['pt-BR', 'en']) {
    const translations = read(`src/assets/i18n/${language}.json5`);
    for (const group of groups) {
      assert.ok(translations.includes(`"info.tutoriais.group.${group.id}"`));
    }
    for (const document of documents) {
      for (const suffix of ['title', 'description']) {
        assert.ok(translations.includes(`"info.tutoriais.${document.id}.${suffix}"`));
      }
    }
  }
  const template = read('src/app/info/tutoriais/tutoriais.component.html');
  assert.match(template, /target="_blank" rel="noopener noreferrer"/);
  assert.match(template, /info.tutoriais.new-tab/);
});
