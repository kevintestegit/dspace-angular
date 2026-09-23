import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';
import { ThemedSearchNavbarComponent } from '../../../../app/search-navbar/themed-search-navbar.component';
import { ThemedAuthNavMenuComponent } from '../../../../app/shared/auth-nav-menu/themed-auth-nav-menu.component';
import { ThemedLangSwitchComponent } from '../../../../app/shared/lang-switch/themed-lang-switch.component';

@Component({
  selector: 'ds-themed-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  imports: [
    AsyncPipe,
    NgbDropdownModule,
    ThemedAuthNavMenuComponent,
    ThemedLangSwitchComponent,
    ThemedSearchNavbarComponent,
    TranslateModule,
  ],
})
export class HeaderComponent extends BaseComponent {
}
