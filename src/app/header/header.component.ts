import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ThemedSearchNavbarComponent } from '../search-navbar/themed-search-navbar.component';
import { ThemedAuthNavMenuComponent } from '../shared/auth-nav-menu/themed-auth-nav-menu.component';
import { ThemedLangSwitchComponent } from '../shared/lang-switch/themed-lang-switch.component';
import {
  HostWindowService,
  WidthCategory,
} from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-base-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
  imports: [
    AsyncPipe,
    NgbDropdownModule,
    ThemedAuthNavMenuComponent,
    ThemedLangSwitchComponent,
    ThemedSearchNavbarComponent,
    TranslateModule,
  ],
})
export class HeaderComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isMobile$: Observable<boolean>;

  menuID = MenuID.PUBLIC;
  maxMobileWidth = WidthCategory.SM;

  constructor(
    protected menuService: MenuService,
    protected windowService: HostWindowService,
  ) {
  }

  ngOnInit(): void {
    this.isMobile$ = this.windowService.isUpTo(this.maxMobileWidth);
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }
}
