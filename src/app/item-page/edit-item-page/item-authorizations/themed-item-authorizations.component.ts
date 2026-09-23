import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemAuthorizationsComponent } from './item-authorizations.component';

@Component({
  selector: 'ds-item-authorizations',
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedItemAuthorizationsComponent extends ThemedComponent<ItemAuthorizationsComponent> {
  protected getComponentName(): string {
    return 'ItemAuthorizationsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-authorizations/item-authorizations.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-authorizations.component');
  }
}
