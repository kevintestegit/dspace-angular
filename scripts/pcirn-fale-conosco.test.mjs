import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const component = await readFile(new URL('../src/themes/custom/app/info/fale-conosco/fale-conosco.component.ts', import.meta.url), 'utf8');
const template = await readFile(new URL('../src/themes/custom/app/info/fale-conosco/fale-conosco.component.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/themes/custom/app/info/fale-conosco/fale-conosco.component.scss', import.meta.url), 'utf8');
const formTemplate = await readFile(new URL('../src/themes/custom/app/info/feedback/feedback-form/feedback-form.component.html', import.meta.url), 'utf8');
const formStyles = await readFile(new URL('../src/themes/custom/app/info/feedback/feedback-form/feedback-form.component.scss', import.meta.url), 'utf8');

test('fale-conosco component provides copyEmail helper and router navigation', () => {
  assert.match(component, /export class FaleConoscoComponent extends BaseComponent/);
  assert.match(component, /copiedEmail = false/);
  assert.match(component, /copyEmail\(\): void/);
  assert.match(component, /arquivogeral@pci\.rn\.gov\.br/);
  assert.match(component, /RouterLink/);
});

test('fale-conosco template renders the PCIRN institutional header and chips', () => {
  assert.match(template, /class="pcirn-list pcirn-contact-surface"/);
  assert.match(template, /class="pcirn-contact-header"/);
  assert.match(template, /class="pcirn-contact-pill-badge"/);
  assert.match(template, /info\.fale-conosco\.title/);
  assert.match(template, /class="pcirn-topic-chips"/);
});

test('fale-conosco template features a responsive 2-column layout with form and official channels', () => {
  assert.match(template, /class="pcirn-contact-grid"/);
  assert.match(template, /<ds-feedback-form><\/ds-feedback-form>/);
  assert.match(template, /class="pcirn-contact-sidebar"/);
  assert.match(template, /arquivogeral@pci\.rn\.gov\.br/);
  assert.match(template, /\(84\) 3232-6928/);
  assert.match(template, /Unidade PCI-NUGECID/);
  assert.match(template, /NUGECID/);
  assert.match(template, /routerLink="\/info\/ajuda"/);
  assert.match(template, /routerLink="\/info\/politica-acesso"/);
  assert.match(template, /routerLink="\/info\/about"/);
  assert.match(template, /class="pcirn-guidance-card"/);
});

test('feedback form template includes accessible inputs, labels, context box, and submit action', () => {
  assert.match(formTemplate, /formControlName="email"/);
  assert.match(formTemplate, /formControlName="message"/);
  assert.match(formTemplate, /formControlName="page"/);
  assert.match(formTemplate, /pcirn-context-box/);
  assert.match(formTemplate, /pcirn-btn-send/);
  assert.match(formTemplate, /info\.feedback\.send/);
});

test('styles define the asymmetric grid, card elevation, and mobile breakpoint', () => {
  assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*1\.4fr\)\s*minmax\(0,\s*1fr\)/);
  assert.match(styles, /@media\s*\(max-width:\s*991px\)\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(formStyles, /\.pcirn-feedback-card/);
  assert.match(formStyles, /\.pcirn-btn-send/);
});
