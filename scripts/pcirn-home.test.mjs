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
const customUserMenuComponent = await readFile(new URL('../src/themes/custom/app/shared/auth-nav-menu/user-menu/user-menu.component.ts', import.meta.url), 'utf8');
const customUserMenuTemplate = await readFile(new URL('../src/themes/custom/app/shared/auth-nav-menu/user-menu/user-menu.component.html', import.meta.url), 'utf8');
const customUserMenuStyles = await readFile(new URL('../src/themes/custom/app/shared/auth-nav-menu/user-menu/user-menu.component.scss', import.meta.url), 'utf8');
const customAuthNavMenuComponent = await readFile(new URL('../src/themes/custom/app/shared/auth-nav-menu/auth-nav-menu.component.ts', import.meta.url), 'utf8');
const customAuthNavMenuStyles = await readFile(new URL('../src/themes/custom/app/shared/auth-nav-menu/auth-nav-menu.component.scss', import.meta.url), 'utf8');
const adminRoutes = await readFile(new URL('../src/app/admin/admin-routes.ts', import.meta.url), 'utf8');
const expandableMenuProvider = await readFile(new URL('../src/app/shared/menu/providers/helper-providers/expandable-menu-provider.ts', import.meta.url), 'utf8');
const newMenuProvider = await readFile(new URL('../src/app/shared/menu/providers/new.menu.ts', import.meta.url), 'utf8');
const navbarTemplate = await readFile(new URL('../src/app/navbar/navbar.component.html', import.meta.url), 'utf8');
const customNavbarTemplate = await readFile(new URL('../src/themes/custom/app/navbar/navbar.component.html', import.meta.url), 'utf8');
const navbarStyles = await readFile(new URL('../src/app/navbar/navbar.component.scss', import.meta.url), 'utf8');
const footerTemplate = await readFile(new URL('../src/app/footer/footer.component.html', import.meta.url), 'utf8');
const footerStyles = await readFile(new URL('../src/app/footer/footer.component.scss', import.meta.url), 'utf8');
const globalStyles = await readFile(new URL('../src/styles/_global-styles.scss', import.meta.url), 'utf8');
const homeDataService = await readFile(new URL('../src/themes/custom/app/home-page/pcirn-home-data.service.ts', import.meta.url), 'utf8');
const statisticsMenu = await readFile(new URL('../src/app/shared/menu/providers/statistics.menu.ts', import.meta.url), 'utf8');
const headerWrapperTemplate = await readFile(new URL('../src/app/header-nav-wrapper/header-navbar-wrapper.component.html', import.meta.url), 'utf8');
const headerWrapperStyles = await readFile(new URL('../src/app/header-nav-wrapper/header-navbar-wrapper.component.scss', import.meta.url), 'utf8');
const customHeaderWrapperStyles = await readFile(new URL('../src/themes/custom/app/header-nav-wrapper/header-navbar-wrapper.component.scss', import.meta.url), 'utf8');
const customHeaderStyles = await readFile(new URL('../src/themes/custom/app/header/header.component.scss', import.meta.url), 'utf8');
const indexHtml = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');
const customGlobalStyles = await readFile(new URL('../src/themes/custom/styles/_global-styles.scss', import.meta.url), 'utf8');

test('home follows the institutional PCIRN composition', () => {
  assert.match(template, /'pcirn\.home\.hero\.title\.part1'\s*\|\s*translate/);
  assert.match(template, /'pcirn\.home\.hero\.lead'\s*\|\s*translate/);
  assert.match(ptBrTranslations, /"pcirn\.home\.hero\.lead":\s*"Consulte normas, portarias, relatórios e publicações oficiais/i);
  assert.match(template, /pcirn-home-hero/);
  assert.match(template, /pcirn-home-search/);
  assert.match(template, /pcirn-home-search-chips/);
  assert.match(template, /'pcirn\.home\.search\.chip\.regulations'\s*\|\s*translate/);
  assert.match(template, /'pcirn\.home\.search\.chip\.pops'\s*\|\s*translate/);
  assert.match(template, /'pcirn\.home\.search\.chip\.research'\s*\|\s*translate/);
  assert.match(template, /'pcirn\.home\.search\.chip\.reports'\s*\|\s*translate/);
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
  assert.match(template, /pcirn\.home\.quick-access\.requires-login/);
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

test('footer is rendered across all pages', () => {
  assert.doesNotMatch(rootComponent, /!authenticated && route === '\/home'/);
  assert.doesNotMatch(rootTemplate, /@if \(\(showFooter\$ \| async\) === true\)/);
  assert.match(rootTemplate, /<ds-footer class="pcirn-home-footer"><\/ds-footer>/);
});

test('login page hides the site chrome', () => {
  assert.match(rootComponent, /isLoginRoute\$: Observable<boolean>/);
  assert.match(rootTemplate, /@if \(\(isLoginRoute\$ \| async\) !== true\)/);
  assert.match(rootTemplate, /<ds-header-navbar-wrapper><\/ds-header-navbar-wrapper>/);
});

test('authenticated navigation moves sectors into the user menu', () => {
  assert.doesNotMatch(rootTemplate, /<ds-sector-sidebar><\/ds-sector-sidebar>/);
  assert.doesNotMatch(rootComponent, /ThemedSectorSidebarComponent/);
  assert.match(customUserMenuComponent, /templateUrl:\s*'\.\/user-menu\.component\.html'/);
  assert.match(customUserMenuComponent, /UserSectorsService/);
  assert.match(customUserMenuComponent, /ThemedCreateItemParentSelectorComponent/);
  assert.match(ptBrTranslations, /"user-menu\.add-document":\s*"Novo documento"/);
  assert.match(ptBrTranslations, /"user-menu\.sectors":\s*"Meus setores"/);
});

test('authenticated menu gives identity, sectors, and account actions a clear hierarchy', () => {
  assert.match(customUserMenuTemplate, /pcirn-user-menu/);
  assert.match(customUserMenuTemplate, /pcirn-user-menu-profile/);
  assert.match(customUserMenuTemplate, /pcirn-user-menu-primary/);
  assert.match(customUserMenuTemplate, /pcirn-user-menu-sector/);
  assert.match(customUserMenuTemplate, /pcirn-user-menu-admin/);
  assert.match(customUserMenuStyles, /\.pcirn-user-menu\s*\{/);
  assert.match(customUserMenuStyles, /\.pcirn-user-menu-primary/);
  assert.match(customUserMenuStyles, /@media \(max-width: 767\.98px\)/);
});

test('profile panel uses one visible dropdown surface', () => {
  assert.match(customAuthNavMenuComponent, /styleUrls:\s*\[[\s\S]*?'\.\/auth-nav-menu\.component\.scss'[\s\S]*?\]/);
  assert.match(customAuthNavMenuStyles, /#logoutDropdownMenu/);
  assert.match(customAuthNavMenuStyles, /padding:\s*0 !important/);
  assert.match(customAuthNavMenuStyles, /background:\s*transparent/);
  assert.match(customAuthNavMenuStyles, /box-shadow:\s*none/);
});

test('login dropdown retains the base auth menu styles', () => {
  assert.match(customAuthNavMenuComponent, /styleUrls:\s*\[[\s\S]*?\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/app\/shared\/auth-nav-menu\/auth-nav-menu\.component\.scss'[\s\S]*?'\.\/auth-nav-menu\.component\.scss'[\s\S]*?\]/);
});

test('administrative navigation moves from the sidebar to the admin hub', () => {
  assert.doesNotMatch(rootTemplate, /<ds-admin-sidebar/);
  assert.doesNotMatch(rootComponent, /ThemedAdminSidebarComponent/);
  assert.match(customUserMenuTemplate, /\['\/admin'\]/);
  assert.match(customUserMenuTemplate, /user-menu\.administration/);
  assert.match(adminRoutes, /ThemedAdminDashboardComponent/);
  assert.match(adminRoutes, /path:\s*'',\s*pathMatch:\s*'full'/);
  assert.match(ptBrTranslations, /"user-menu\.administration":\s*"Administração"/);
});

test('administrative expandable menus disappear when all subsections are unauthorized', () => {
  assert.match(expandableMenuProvider, /partialSubSections\.some\(section => section\.visible\)/);
  assert.match(newMenuProvider, /FeatureID\.IsCollectionAdmin/);
  assert.match(newMenuProvider, /FeatureID\.CanEditItem/);
  assert.match(newMenuProvider, /canSubmit &&/);
});

test('anonymous navbar shows the institutional repository title and hides statistics', () => {
  assert.match(navbarTemplate, /Repositório Institucional<\/span><strong>PCIRN/);
  assert.match(customNavbarTemplate, /\{\{ 'item\.page\.publications' \| translate \}\}/);
  assert.match(ptBrTranslations, /"pcirn\.header\.name":\s*"Repositório Institucional"/);
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
  assert.match(footerTemplate, /'pcirn\.header\.name'\s*\|\s*translate/);
  assert.match(ptBrTranslations, /"pcirn\.header\.name":\s*"Repositório Institucional"/);
  assert.match(footerTemplate, /NUGECID/);
  assert.match(footerTemplate, /routerLink="\/info\/politica-acesso">\{\{\s*'info\.access-policy\.title'\s*\|\s*translate\s*\}\}<\/a>/);
  assert.doesNotMatch(footerTemplate, /routerLink="\/info\/accessibility"/);
  assert.match(footerTemplate, /routerLink="\/info\/ajuda">\{\{\s*'pcirn\.footer\.help\.feedback'\s*\|\s*translate\s*\}\}<\/a>/);
  assert.doesNotMatch(footerTemplate, /routerLink="\/info\/feedback"/);
  assert.match(footerStyles, /pcirn-footer/);
});

test('home closes the layout gap before the footer', () => {
  assert.match(rootTemplate, /<ds-footer class="pcirn-home-footer"><\/ds-footer>/);
  assert.match(globalStyles, /ds-footer\.pcirn-home-footer\s*\{\s*display:\s*block;\s*margin-top:\s*calc\(var\(--ds-content-spacing\) \* -1\);/);
  assert.match(globalStyles, /ds-footer\.pcirn-home-footer \.pcirn-footer\s*\{\s*margin-top:\s*0;/);
});

test('home hero sits flush under the header while breadcrumb pages keep their spacing', () => {
  assert.match(customGlobalStyles, /main\.my-cs\s*\{\s*margin-top:\s*0;/);
  assert.match(customGlobalStyles, /\.pcirn-breadcrumb\s*\{\s*margin-bottom:\s*var\(--ds-content-spacing\);/);
});

test('header trims the white flap without resizing the blue shape', () => {
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 767\.98px\) \{[\s\S]*?\.pcirn-header-masthead \{ height: 92px; \}[\s\S]*?\.pcirn-header-brand-mark \{ height: 88px; width: 76px; \}/);
  assert.match(customHeaderWrapperStyles, /@media \(min-width: 768px\) and \(max-width: 1599\.98px\) \{\s*\.pcirn-header-masthead \{ height: 80px; \}/);
  assert.match(customHeaderWrapperStyles, /#header-navbar-wrapper::before \{[\s\S]*?height: 80px;/);
});

test('masthead blue band tiles the seamless hair-cell texture under the drawing', () => {
  assert.match(customHeaderWrapperStyles, /#header-navbar-wrapper::before \{[\s\S]*?url\('\/assets\/pcirn\/images\/desenho1\.png'\)[\s\S]*?url\('\/assets\/pcirn\/images\/haircell-blue\.svg'\) 0 0 \/ 240px 240px repeat,[\s\S]*?#073c66;/);
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 767\.98px\) \{[\s\S]*?#header-navbar-wrapper::before \{[\s\S]*?background-position: center 58%, 0 0;[\s\S]*?background-size: 100% auto, 240px 240px;/);
});

test('header keeps one desktop masthead height across zoom breakpoints', () => {
  assert.match(customHeaderWrapperStyles, /\.pcirn-header-masthead \{[\s\S]*?height: 80px;/);
  assert.match(customHeaderWrapperStyles, /@media \(min-width: 768px\) and \(max-width: 1599\.98px\) \{[\s\S]*?\.pcirn-header-masthead \{ height: 80px; \}/);
  assert.doesNotMatch(customHeaderWrapperStyles, /@media \(min-width: 1200px\) and \(max-width: 1599\.98px\) \{\s*\.pcirn-header-masthead \{ height: 80px; \}\s*\}/);
});

test('header keeps the desktop white navigation band compact', () => {
  assert.match(customHeaderWrapperStyles, /\.pcirn-header-navigation \{[\s\S]*?min-height: 48px;/);
  assert.match(customHeaderWrapperStyles, /@media \(min-width: 768px\) and \(max-width: 1599\.98px\) \{[\s\S]*?\.pcirn-header-navigation \{ min-height: 48px;/);
  assert.match(customHeaderStyles, /\.pcirn-header-tools \{[\s\S]*?min-height: 48px;/);
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 767\.98px\) \{[\s\S]*?\.pcirn-header-navigation \{[\s\S]*?min-height: 0;/);
});

test('header centers PCIRN in the lower desktop masthead curve', () => {
  assert.match(customHeaderWrapperStyles, /\.pcirn-header-brand-copy \{[\s\S]*?position: relative;/);
  assert.match(customHeaderWrapperStyles, /@media \(min-width: 1200px\) \{[\s\S]*?\.pcirn-header-brand-copy \{[\s\S]*?align-items: center;[\s\S]*?left: calc\(20\.1823vw - var\(--header-gutter\)\);[\s\S]*?position: absolute;[\s\S]*?top: -4px;[\s\S]*?transform: translateX\(-50%\);[\s\S]*?width: max-content;[\s\S]*?\}[\s\S]*?\.pcirn-header-brand-copy strong \{[\s\S]*?position: static;/);
});

test('header keeps the brand legible at every breakpoint', () => {
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 767\.98px\) \{[\s\S]*?#header-navbar-wrapper::before \{[\s\S]*?height: 80px;/);
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 480px\) \{[\s\S]*?\.pcirn-header-brand-subtitle \{[\s\S]*?left: auto;[\s\S]*?right: var\(--header-gutter\);[\s\S]*?transform: none;/);
  assert.match(customHeaderWrapperStyles, /@media \(max-width: 359\.98px\) \{[\s\S]*?#header-navbar-wrapper::before \{ height: 92px; \}/);
  assert.match(customHeaderWrapperStyles, /@media \(min-width: 768px\) and \(max-width: 1199\.98px\) \{[\s\S]*?\.pcirn-header-brand-copy strong \{ font-size: 30px; \}/);
});

test('home hero stacks above the search card on very narrow screens', () => {
  assert.match(heroStyles, /@media \(max-width: 364\.98px\) \{[\s\S]*?\.pcirn-home-hero \{[\s\S]*?height: auto;[\s\S]*?\.pcirn-home-search \{[\s\S]*?position: static;/);
  assert.match(heroStyles, /\.pcirn-home-hero-forensics \{[\s\S]*?width: min\(20rem, 100%\)/);
});

test('legacy footer injection is not loaded', () => {
  assert.doesNotMatch(indexHtml, /pcirn-footer\.js|pcirn\.css/);
});
