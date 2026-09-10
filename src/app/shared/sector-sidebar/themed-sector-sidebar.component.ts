import { Component } from '@angular/core';

import { ThemedComponent } from '../theme-support/themed.component';
import { SectorSidebarComponent } from './sector-sidebar.component';

@Component({
  selector: 'ds-sector-sidebar',
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedSectorSidebarComponent extends ThemedComponent<SectorSidebarComponent> {

  protected getComponentName(): string {
    return 'SectorSidebarComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/sector-sidebar/sector-sidebar.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./sector-sidebar.component');
  }
}
