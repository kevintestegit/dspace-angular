import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SearchNavbarComponent as BaseComponent } from '../../../../app/search-navbar/search-navbar.component';
import { BrowserOnlyPipe } from '../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-search-navbar',
  styleUrls: ['./search-navbar.component.scss'],
  templateUrl: './search-navbar.component.html',
  imports: [
    BrowserOnlyPipe,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class SearchNavbarComponent extends BaseComponent {
}
