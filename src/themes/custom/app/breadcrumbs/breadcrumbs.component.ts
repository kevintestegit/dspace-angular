import {
  AsyncPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbsComponent as BaseComponent } from '../../../../app/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsService } from '../../../../app/breadcrumbs/breadcrumbs.service';
import { VarDirective } from '../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  imports: [
    AsyncPipe,
    NgbTooltip,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
})
export class BreadcrumbsComponent extends BaseComponent {

  constructor(
    breadcrumbsService: BreadcrumbsService,
    private router: Router,
  ) {
    super(breadcrumbsService);
  }

  /**
   * CSS modifier that aligns the breadcrumb rail with the content rail of the
   * current page family.
   */
  get pcirnSurface(): string {
    const path = this.router.url.split(/[?#]/)[0];
    if (/^\/items\/[^/]+(\/full)?\/?$/.test(path)) {
      return 'pcirn-breadcrumb--item';
    }
    if (path.startsWith('/community-list') || path.startsWith('/collection-list')) {
      return 'pcirn-breadcrumb--list';
    }
    if (path.startsWith('/search')) {
      return 'pcirn-breadcrumb--search';
    }
    return '';
  }
}
