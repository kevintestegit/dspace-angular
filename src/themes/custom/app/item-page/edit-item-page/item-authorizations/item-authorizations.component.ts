import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ItemAuthorizationsComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-authorizations/item-authorizations.component';
import { AlertComponent } from '../../../../../../app/shared/alert/alert.component';
import { ResourcePoliciesComponent } from '../../../../../../app/shared/resource-policies/resource-policies.component';

@Component({
  selector: 'ds-themed-item-authorizations',
  templateUrl: './item-authorizations.component.html',
  styleUrls: ['./item-authorizations.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    NgbCollapseModule,
    ResourcePoliciesComponent,
    TranslateModule,
  ],
})
export class ItemAuthorizationsComponent extends BaseComponent {
}
