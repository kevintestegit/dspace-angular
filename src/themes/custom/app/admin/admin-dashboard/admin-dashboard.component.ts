import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  getEPersonsRoute,
  getGroupsRoute,
} from '../../../../../app/access-control/access-control-routing-paths';
import { AdminDashboardComponent as BaseComponent } from '../../../../../app/admin/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'ds-themed-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class AdminDashboardComponent extends BaseComponent {
  readonly userRegistryRoute = getEPersonsRoute();
  readonly groupRegistryRoute = getGroupsRoute();
}
