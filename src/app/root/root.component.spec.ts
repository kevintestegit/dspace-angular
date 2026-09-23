import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AccessibilitySettingsService } from '../accessibility/accessibility-settings.service';
import { AccessibilitySettingsServiceStub } from '../accessibility/accessibility-settings.service.stub';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { RouterMock } from '../shared/mocks/router.mock';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        RootComponent,
      ],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: AccessibilitySettingsService, useValue: new AccessibilitySettingsServiceStub() },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RootComponent, {
        remove: {
          imports: [
            SystemWideAlertBannerComponent,
            ThemedHeaderNavbarWrapperComponent,
            ThemedBreadcrumbsComponent,
            ThemedLoadingComponent,
            ThemedFooterComponent,
            NotificationsBoardComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
