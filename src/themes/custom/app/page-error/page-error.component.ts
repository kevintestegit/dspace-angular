import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PageErrorComponent as BaseComponent } from '../../../../app/page-error/page-error.component';

@Component({
  selector: 'ds-themed-page-error',
  styleUrls: ['./page-error.component.scss'],
  templateUrl: './page-error.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class PageErrorComponent extends BaseComponent {
}
