import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PaginationService } from '../../../../app/core/pagination/pagination.service';
import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../app/my-dspace-page/my-dspace-configuration.service';
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
    AsyncPipe,
    ThemedSearchComponent,
    TranslateModule,
  ],
})
export class SearchPageComponent extends BaseComponent {

  semantic$: Observable<boolean>;

  constructor(
    private paginationService: PaginationService,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigurationService: SearchConfigurationService,
  ) {
    super();
    this.semantic$ = this.searchConfigurationService.getCurrentSemantic();
  }

  toggleSemantic(event: Event) {
    const semantic = (event.target as HTMLInputElement).checked;
    this.paginationService.updateRoute(
      this.searchConfigurationService.paginationID,
      { page: 1 },
      { semantic: semantic ? 'true' : null },
    );
  }
}
