import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AjudaComponent } from './ajuda.component';

/**
 * Themed wrapper for AjudaComponent
 */
@Component({
  selector: 'ds-ajuda-themed',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedAjudaComponent extends ThemedComponent<AjudaComponent> {
  protected getComponentName(): string {
    return 'AjudaComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/ajuda/ajuda.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./ajuda.component`);
  }
}
