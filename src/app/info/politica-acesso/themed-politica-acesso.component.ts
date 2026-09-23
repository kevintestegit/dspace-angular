import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { PoliticaAcessoComponent } from './politica-acesso.component';

/**
 * Themed wrapper for PoliticaAcessoComponent
 */
@Component({
  selector: 'ds-politica-acesso-themed',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedPoliticaAcessoComponent extends ThemedComponent<PoliticaAcessoComponent> {
  protected getComponentName(): string {
    return 'PoliticaAcessoComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/politica-acesso/politica-acesso.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./politica-acesso.component`);
  }
}
