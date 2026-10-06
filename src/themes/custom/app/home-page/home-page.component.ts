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
import { TranslateModule } from '@ngx-translate/core';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

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
  readonly quickAccess: PcirnQuickAccessCard[] = buildQuickAccess();
  readonly searchConfigurations = PCIRN_SEARCH_CONFIGURATIONS;

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    route: ActivatedRoute,
    homeData: PcirnHomeDataService,
  ) {
    super(appConfig, route);
    this.pcirnHomeData = homeData;
  }
}
