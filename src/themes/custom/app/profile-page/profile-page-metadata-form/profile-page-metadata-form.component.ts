import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ProfilePageMetadataFormComponent as BaseComponent } from '../../../../../app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component';
import { FormComponent } from '../../../../../app/shared/form/form.component';

@Component({
  selector: 'ds-themed-profile-page-metadata-form',
  templateUrl: './profile-page-metadata-form.component.html',
  imports: [
    FormComponent,
    TranslateModule,
  ],
})
/**
 * PCIRN metadata form.
 *
 * The e-mail address is provisioned by an administrator and cannot be edited here, so it is
 * rendered as read-only data instead of a disabled input that traps the keyboard focus order.
 */
export class ProfilePageMetadataFormComponent extends BaseComponent {

  ngOnInit(): void {
    this.formModel = this.formModel.filter((model) => model.id !== 'email');
    super.ngOnInit();
  }

}
