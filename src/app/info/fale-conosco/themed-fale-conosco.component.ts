import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { FaleConoscoComponent } from './fale-conosco.component';

/**
 * Themed wrapper for FaleConoscoComponent
 */
@Component({
  selector: 'ds-fale-conosco-themed',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedFaleConoscoComponent extends ThemedComponent<FaleConoscoComponent> {
  protected getComponentName(): string {
    return 'FaleConoscoComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/fale-conosco/fale-conosco.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./fale-conosco.component`);
  }
}
