import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const readConfig = (path) => readFileSync(new URL(`../../../dspace/config/${path}`, import.meta.url), 'utf8');
const template = read('src/app/info/documentos/documentos.component.html');
const catalog = read('src/app/info/documentos/documents.catalog.ts');
const service = read('src/app/info/documentos/pcirn-link-documents.service.ts');
const tutorialsTemplate = read('src/app/info/tutoriais/tutoriais.component.html');
const routes = read('src/app/info/info-routes.ts');
const paths = read('src/app/info/info-routing-paths.ts');
const navbar = read('src/app/navbar/navbar.component.html');
const customNavbar = read('src/themes/custom/app/navbar/navbar.component.html');
const navbarComponent = read('src/app/navbar/navbar.component.ts');
const footer = read('src/app/footer/footer.component.html');
const submissionForms = readConfig('submission-forms.xml');
const vocabulary = readConfig('controlled-vocabularies/pcirn-document-types.xml');
const itemSubmission = readConfig('item-submission.xml');

test('documents page is public and sits right after home in the main navigation', () => {
  assert.match(paths, /DOCUMENTOS_PATH\s*=\s*'documentos'/);
  const route = routes.split('path: DOCUMENTOS_PATH,')[1].split('\n  },')[0];
  assert.match(route, /component: DocumentosComponent/);
  assert.doesNotMatch(route, /canActivate/);
  assert.match(navbar, /routerLink="\/info\/documentos"[\s\S]*?routerLink="\/community-list"/);
  assert.match(customNavbar, /routerLink="\/info\/documentos"[\s\S]*?routerLink="\/community-list"/);
  assert.match(navbarComponent, /'documents'/);
  assert.equal(footer.match(/routerLink="\/info\/documentos"/g).length, 1);
});

test('catalogue is a plain list of links to the portaria and the technical manual', () => {
  assert.match(catalog, /path: '\/handle\/123456789\/29'/);
  assert.match(catalog, /path: '\/handle\/123456789\/24'/);
  assert.doesNotMatch(catalog, /regulamento/);
  assert.match(template, /class="documents-list"/);
  assert.doesNotMatch(template, /pcirn-list|icon|description|meta|badge/);
});

test('documents and tutorials also read link entries published in the NUGECID collection', () => {
  assert.match(service, /Documentos do NUGECID/);
  assert.match(service, /dc\.type:"\$\{type\}"/);
  assert.match(service, /dc\.relation\.isreferencedby/);
  assert.match(service, /http/);
  assert.match(template, /linkDocuments\$ \| async/);
  assert.match(tutorialsTemplate, /linkTutorials\$ \| async/);
});

test('link-only deposits are enabled for the NUGECID collection', () => {
  assert.match(submissionForms, /<dc-qualifier>isreferencedby<\/dc-qualifier>/);
  assert.match(submissionForms, /<label>Link do documento<\/label>/);
  assert.match(vocabulary, /id="DOCUMENTO_INSTITUCIONAL" label="Documento institucional"/);
  assert.match(vocabulary, /id="TUTORIAL" label="Tutorial"/);
  assert.match(itemSubmission, /collection-handle="123456789\/34" submission-name="pcirnlink"/);
  assert.match(itemSubmission, /<step-definition id="uploadoptional" mandatory="false">/);
  assert.match(itemSubmission, /<submission-process name="pcirnlink">[\s\S]*?<step id="pcirnpagetwo"\/>/);
  assert.doesNotMatch(submissionForms, /pcirnlinkdestino|pcirn_destinos/);
});

test('page translates every document name in both languages', () => {
  for (const language of ['pt-BR', 'en']) {
    const translations = read(`src/assets/i18n/${language}.json5`);
    assert.ok(translations.includes('"info.documentos.title"'));
    assert.ok(translations.includes('"info.documentos.breadcrumbs"'));
    for (const id of ['portaria', 'manual', 'acesso', 'privacidade', 'termo', 'tutoriais']) {
      assert.ok(translations.includes(`"info.documentos.${id}.title"`), `missing ${language} info.documentos.${id}.title`);
    }
    assert.doesNotMatch(translations, /"info\.documentos\.(group\.|soon|.*\.description|.*\.meta)/);
  }
});
