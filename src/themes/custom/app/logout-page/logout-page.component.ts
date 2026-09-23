import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LogoutPageComponent as BaseComponent } from '../../../../app/logout-page/logout-page.component';
import { LogOutComponent } from '../../../../app/shared/log-out/log-out.component';

@Component({
  selector: 'ds-themed-logout-page',
  styleUrls: ['./logout-page.component.scss'],
  templateUrl: './logout-page.component.html',
  imports: [
    LogOutComponent,
    TranslateModule,
    RouterLink,
  ],
})
export class LogoutPageComponent extends BaseComponent {
}
