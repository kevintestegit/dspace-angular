import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { AppState } from '../../../../app/app.reducer';
import { isAuthenticated } from '../../../../app/core/auth/selectors';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { ThemedSearchFormComponent } from '../../../../app/shared/search-form/themed-search-form.component';
import { PcirnDocumentTypePipe } from '../../../../app/shared/utils/pcirn-document-type.pipe';
import {
  buildQuickAccess,
  PCIRN_SEARCH_CONFIGURATIONS,
  PcirnHomeDataService,
  PcirnQuickAccessCard,
} from './pcirn-home-data.service';

@Component({
  selector: 'ds-themed-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    PcirnDocumentTypePipe,
    RouterLink,
    ThemedSearchFormComponent,
    TranslateModule,
  ],
})
export class HomePageComponent extends BaseComponent {
  readonly pcirnHomeData: PcirnHomeDataService;
  readonly quickAccess$: Observable<PcirnQuickAccessCard[]>;
  readonly searchConfigurations = PCIRN_SEARCH_CONFIGURATIONS;

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    route: ActivatedRoute,
    private readonly store: Store<AppState>,
    homeData: PcirnHomeDataService,
  ) {
    super(appConfig, route);
    this.pcirnHomeData = homeData;
    this.quickAccess$ = this.store.pipe(
      select(isAuthenticated),
      map(authenticated => buildQuickAccess(authenticated)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
