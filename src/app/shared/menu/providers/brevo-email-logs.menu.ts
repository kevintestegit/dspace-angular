import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { MenuItemType } from '../menu-item-type.model';
import { AbstractMenuProvider, PartialMenuSection } from '../menu-provider.model';

@Injectable()
export class BrevoEmailLogsMenuProvider extends AbstractMenuProvider {
  constructor(protected authorizationService: AuthorizationDataService) {
    super();
  }

  getSections(): Observable<PartialMenuSection[]> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      map((isAdmin) => [{
        visible: isAdmin,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.email_logs',
          link: '/admin/email-logs',
        },
        icon: 'envelope',
      }]),
    );
  }
}
