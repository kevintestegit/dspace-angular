import { Component } from '@angular/core';

import { FaleConoscoComponent as BaseComponent } from '../../../../../app/info/fale-conosco/fale-conosco.component';
import { ThemedFeedbackFormComponent } from '../../../../../app/info/feedback/feedback-form/themed-feedback-form.component';

@Component({
  selector: 'ds-themed-fale-conosco',
  styleUrls: ['../../../../../app/info/fale-conosco/fale-conosco.component.scss'],
  templateUrl: '../../../../../app/info/fale-conosco/fale-conosco.component.html',
  imports: [
    ThemedFeedbackFormComponent,
  ],
})
export class FaleConoscoComponent extends BaseComponent {
}
