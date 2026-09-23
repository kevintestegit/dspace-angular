import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

@Component({
  selector: 'ds-admin-dashboard',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedAdminDashboardComponent extends ThemedComponent<AdminDashboardComponent> {

  protected getComponentName(): string {
    return 'AdminDashboardComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/admin/admin-dashboard/admin-dashboard.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./admin-dashboard.component');
  }
}
