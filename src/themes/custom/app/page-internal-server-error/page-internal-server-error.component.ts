import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PageInternalServerErrorComponent as BaseComponent } from '../../../../app/page-internal-server-error/page-internal-server-error.component';

@Component({
  selector: 'ds-themed-page-internal-server-error',
  styleUrls: ['./page-internal-server-error.component.scss'],
  templateUrl: './page-internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class PageInternalServerErrorComponent extends BaseComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.add('pcirn-offline-mode');
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('pcirn-offline-mode');
    }
  }

  reload(): void {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
