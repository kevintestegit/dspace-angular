import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const template = await readFile(new URL('../src/themes/custom/app/home-page/home-page.component.html', import.meta.url), 'utf8');
const appConfig = await readFile(new URL('../src/config/default-app-config.ts', import.meta.url), 'utf8');
const appRoutes = await readFile(new URL('../src/app/app-routes.ts', import.meta.url), 'utf8');
const heroStyles = await readFile(new URL('../src/themes/custom/app/home-page/home-page.component.scss', import.meta.url), 'utf8');
const searchNavbarStyles = await readFile(new URL('../src/app/search-navbar/search-navbar.component.scss', import.meta.url), 'utf8');
const ptBrTranslations = await readFile(new URL('../src/assets/i18n/pt-BR.json5', import.meta.url), 'utf8');
const rootComponent = await readFile(new URL('../src/app/root/root.component.ts', import.meta.url), 'utf8');
const rootTemplate = await readFile(new URL('../src/app/root/root.component.html', import.meta.url), 'utf8');
const sectorSidebarComponent = await readFile(new URL('../src/app/shared/sector-sidebar/sector-sidebar.component.ts', import.meta.url), 'utf8');
const sectorSidebarService = await readFile(new URL('../src/app/shared/sector-sidebar/sector-sidebar.service.ts', import.meta.url), 'utf8');
const sectorSidebarTemplate = await readFile(new URL('../src/app/shared/sector-sidebar/sector-sidebar.component.html', import.meta.url), 'utf8');
const expandableMenuProvider = await readFile(new URL('../src/app/shared/menu/providers/helper-providers/expandable-menu-provider.ts', import.meta.url), 'utf8');
const newMenuProvider = await readFile(new URL('../src/app/shared/menu/providers/new.menu.ts', import.meta.url), 'utf8');
const navbarTemplate = await readFile(new URL('../src/app/navbar/navbar.component.html', import.meta.url), 'utf8');
const navbarStyles = await readFile(new URL('../src/app/navbar/navbar.component.scss', import.meta.url), 'utf8');
const footerTemplate = await readFile(new URL('../src/app/footer/footer.component.html', import.meta.url), 'utf8');
const footerStyles = await readFile(new URL('../src/app/footer/footer.component.scss', import.meta.url), 'utf8');
const globalStyles = await readFile(new URL('../src/styles/_global-styles.scss', import.meta.url), 'utf8');
const homeDataService = await readFile(new URL('../src/themes/custom/app/home-page/pcirn-home-data.service.ts', import.meta.url), 'utf8');
const statisticsMenu = await readFile(new URL('../src/app/shared/menu/providers/statistics.menu.ts', import.meta.url), 'utf8');
const headerWrapperTemplate = await readFile(new URL('../src/app/header-nav-wrapper/header-navbar-wrapper.component.html', import.meta.url), 'utf8');
const headerWrapperStyles = await readFile(new URL('../src/app/header-nav-wrapper/header-navbar-wrapper.component.scss', import.meta.url), 'utf8');
const indexHtml = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');

test('home follows the institutional PCIRN composition', () => {
  assert.match(template, /<span>Documentos<\/span><span>institucionais da <em>PCIRN\.<\/em>/);
  assert.match(template, /normas, portarias, relatórios e publicações oficiais/i);
  assert.match(template, /pcirn-home-hero/);
  assert.match(template, /pcirn-home-search/);
  assert.match(template, /pcirn-home-search-chips/);
  assert.match(template, /Normas e Portarias/);
  assert.match(template, /POPs e Procedimentos/);
  assert.match(template, /Produção Científica/);
  assert.match(template, /Relatórios Técnicos/);
  assert.match(template, /pcirn-home-featured-row/);
  assert.match(template, /pcirn-home-metrics-grid/);
  assert.match(template, /pcirn-home-latest/);
  assert.match(template, /pcirnHomeData/);
  assert.doesNotMatch(template, /pcirn-home-kicker/);
  assert.doesNotMatch(template, /O acervo<\/span><span>em números/);
  assert.doesNotMatch(template, /Relatório Anual de Atividades 2023/);
  assert.doesNotMatch(template, /pcirn-home-about/);
});

test('home cards and data facade use the approved access boundary', () => {
  assert.match(homeDataService, /buildQuickAccess/);
  assert.match(homeDataService, /requiresLogin: true/);
  assert.match(template, /pcirn-home-card-locked/);
  assert.match(template, /requer login/);
});

test('custom theme is enabled for the application', () => {
  assert.match(appConfig, /\n    \{\n      name: 'custom',\n    \},\n\n    \{\n      \/\/ The default dspace theme/);
});

test('browse menu has Portuguese labels for custom definitions', () => {
  assert.match(ptBrTranslations, /"menu\.section\.browse_global_by_type":\s*"Por Tipo"/);
  assert.match(ptBrTranslations, /"menu\.section\.browse_global_by_pcirn-document-types":\s*"Por Tipo de Documento"/);
});

test('expanded header search keeps a small gap above the hero', () => {
  assert.match(searchNavbarStyles, /margin-top:\s*calc\(-0\.5 \* var\(--bs-font-size-base\)\)/);
});

test('hero and search match the compact desktop composition', () => {
  assert.match(heroStyles, /height:\s*350px/);
  assert.match(heroStyles, /1\.5rem 22% \/ 110% auto/);
  assert.match(heroStyles, /\.pcirn-home-search[\s\S]*?max-width:\s*1090px[\s\S]*?width:\s*calc/);
  assert.match(heroStyles, /\.pcirn-home-search-chips/);
  assert.doesNotMatch(heroStyles, /f023/);
});

test('home and public repository reads do not require authentication', () => {
  const routeBlock = (path) => {
    const match = appRoutes.match(new RegExp(`path: '${path}',([\\s\\S]*?)\\n      \\},\\n      \\{\\n        path:`));
    assert.ok(match, `route ${path} not found`);
    return match[0];
  };

  assert.doesNotMatch(routeBlock('home'), /authenticatedGuard|endUserAgreementCurrentUserGuard/);
  assert.doesNotMatch(routeBlock('community-list'), /canActivate: \[authenticatedGuard/);
  assert.doesNotMatch(routeBlock('search'), /canActivate: \[authenticatedGuard/);
});

test('anonymous footer is restricted to the home page', () => {
  assert.match(rootComponent, /!authenticated && route === '\/home'/);
  assert.match(rootTemplate, /@if \(\(showFooter\$ \| async\) === true\)/);
  assert.match(rootTemplate, /<ds-footer class="pcirn-home-footer"><\/ds-footer>/);
});

test('login page hides the site chrome', () => {
  assert.match(rootComponent, /isLoginRoute\$: Observable<boolean>/);
  assert.match(rootTemplate, /@if \(\(isLoginRoute\$ \| async\) !== true\)/);
  assert.match(rootTemplate, /<ds-header-navbar-wrapper><\/ds-header-navbar-wrapper>/);
});

test('regular users get sectors from authorized DSpace communities', () => {
  assert.match(rootTemplate, /<ds-sector-sidebar><\/ds-sector-sidebar>/);
  assert.match(rootComponent, /ThemedSectorSidebarComponent/);
  assert.match(sectorSidebarComponent, /selector: 'ds-base-sector-sidebar'/);
  assert.match(sectorSidebarService, /collectionDataService\.getSubmitAuthorizedCollection/);
  assert.match(sectorSidebarService, /followLink\('parentCommunity'\)/);
  assert.match(sectorSidebarService, /MenuID\.ADMIN/);
});

test('sector sidebar supports multiple authorized communities', () => {
  assert.match(sectorSidebarTemplate, /@for \(community of \(sectorSidebarService\.communities\$ \| async\)/);
  assert.match(sectorSidebarTemplate, /\['\/communities', community\.id\]/);
  assert.match(sectorSidebarTemplate, /sector-sidebar\.add-document/);
  assert.match(sectorSidebarComponent, /ThemedCreateItemParentSelectorComponent/);
  assert.match(sectorSidebarComponent, /openSubmission/);
  assert.match(ptBrTranslations, /"sector-sidebar\.title":\s*"Setores"/);
  assert.match(ptBrTranslations, /"sector-sidebar\.add-document":\s*"Adicionar documento"/);
});

test('administrative expandable menus disappear when all subsections are unauthorized', () => {
  assert.match(expandableMenuProvider, /partialSubSections\.some\(section => section\.visible\)/);
  assert.match(newMenuProvider, /FeatureID\.IsCollectionAdmin/);
  assert.match(newMenuProvider, /FeatureID\.CanEditItem/);
  assert.match(newMenuProvider, /canSubmit &&/);
});

test('anonymous navbar shows the institutional repository title and hides statistics', () => {
  assert.match(navbarTemplate, /Repositório Institucional da<\/span><strong>PCIRN/);
  assert.match(navbarTemplate, /Comunidades/);
  assert.match(navbarTemplate, /Coleções/);
  assert.match(navbarTemplate, /Publicações/);
  assert.match(navbarStyles, /pcirn-header-brand/);
  assert.match(statisticsMenu, /isAuthenticated/);
  assert.match(statisticsMenu, /visible: authorized && authenticated/);
});

test('header uses only the glass navigation shell', () => {
  assert.doesNotMatch(headerWrapperTemplate, /pcirn-announcement/);
  assert.doesNotMatch(headerWrapperTemplate, /Documentos institucionais aprovados pelo NUGECID/);
  assert.match(headerWrapperTemplate, /pcirn-header-glass/);
  assert.match(headerWrapperStyles, /margin:\s*0;/);
});

test('footer uses PCIRN institutional navigation', () => {
  assert.match(footerTemplate, /dspace-logo-mini\.svg/);
  assert.match(footerTemplate, /brasao-estado-rn\.png/);
  assert.match(footerTemplate, /NUGECID/);
  assert.match(footerStyles, /pcirn-footer/);
});

test('home closes the layout gap before the footer', () => {
  assert.match(rootTemplate, /<ds-footer class="pcirn-home-footer"><\/ds-footer>/);
  assert.match(globalStyles, /ds-footer\.pcirn-home-footer\s*\{\s*display:\s*block;\s*margin-top:\s*calc\(var\(--ds-content-spacing\) \* -1\);/);
  assert.match(globalStyles, /ds-footer\.pcirn-home-footer \.pcirn-footer\s*\{\s*margin-top:\s*0;/);
});

test('legacy footer injection is not loaded', () => {
  assert.doesNotMatch(indexHtml, /pcirn-footer\.js|pcirn\.css/);
});
