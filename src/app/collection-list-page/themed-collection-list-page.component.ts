import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { CollectionListPageComponent } from './collection-list-page.component';

/**
 * Themed wrapper for CollectionListPageComponent
 */
@Component({
  selector: 'ds-collection-list-page',
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedCollectionListPageComponent extends ThemedComponent<CollectionListPageComponent> {
  protected getComponentName(): string {
    return 'CollectionListPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/collection-list-page/collection-list-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./collection-list-page.component`);
  }

}
