import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { INotificationBoardOptions } from 'src/config/notifications-config.interfaces';

import { ThemeConfig } from '../../config/theme.config';
import { environment } from '../../environments/environment';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import {
  AppState,
  routerStateSelector,
} from '../app.reducer';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { LiveRegionComponent } from '../shared/live-region/live-region.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';

@Component({
  selector: 'ds-base-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  imports: [
    AsyncPipe,
    LiveRegionComponent,
    NgClass,
    NotificationsBoardComponent,
    RouterOutlet,
    SystemWideAlertBannerComponent,
    ThemedBreadcrumbsComponent,
    ThemedFooterComponent,
    ThemedHeaderNavbarWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class RootComponent implements OnInit {
  theme: Observable<ThemeConfig> = of({} as any);
  isLoginRoute$: Observable<boolean> = of(false);
  notificationOptions: INotificationBoardOptions;
  models: any;

  browserOsClasses = new BehaviorSubject<string[]>([]);

  /**
   * Whether or not to show a full screen loader
   */
  @Input() shouldShowFullscreenLoader: boolean;

  /**
   * Whether or not to show a loader across the router outlet
   */
  @Input() shouldShowRouteLoader: boolean;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
  ) {
    this.notificationOptions = environment.notifications;
  }

  ngOnInit() {
    this.isLoginRoute$ = this.store.pipe(
      select(routerStateSelector),
      map((routerState) => routerState?.state?.url?.split(/[?#]/)[0] === '/login'),
    );

    const browserName = this.getBrowserName();
    if (browserName) {
      const browserOsClasses = new Array<string>();
      browserOsClasses.push(`browser-${browserName}`);
      const osName = this.getOSName();
      if (osName) {
        browserOsClasses.push(`browser-${browserName}-${osName}`);
      }
      this.browserOsClasses.next(browserOsClasses);
    }

    if (this.router.url === getPageInternalServerErrorRoute()) {
      this.shouldShowRouteLoader = false;
    }
  }

  skipToMainContent() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  }

  getBrowserName(): string {
    const userAgent = this._window.nativeWindow.navigator?.userAgent;
    if (/Firefox/.test(userAgent)) {
      return 'firefox';
    }
    if (/Safari/.test(userAgent)) {
      return 'safari';
    }
    return undefined;
  }

  getOSName(): string {
    const userAgent = this._window.nativeWindow.navigator?.userAgent;
    if (/Windows/.test(userAgent)) {
      return 'windows';
    }
    return undefined;
  }
}
