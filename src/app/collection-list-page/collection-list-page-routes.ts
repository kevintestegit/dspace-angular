import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedCollectionListPageComponent } from './themed-collection-list-page.component';

/**
 * RouterModule to help navigate to the page with the collection list
 */
export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedCollectionListPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'collectionList.tabTitle', breadcrumbKey: 'collectionList' },
  },
];
