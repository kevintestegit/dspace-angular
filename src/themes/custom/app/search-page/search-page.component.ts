import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from 'src/app/my-dspace-page/my-dspace-configuration.service';

import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
import { SearchPageComponent as BaseComponent } from '../../../../app/search-page/search-page.component';
import { ThemedSearchComponent } from '../../../../app/shared/search/themed-search.component';

@Component({
  selector: 'ds-themed-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    ThemedSearchComponent,
  ],
})
export class SearchPageComponent extends BaseComponent {
}
