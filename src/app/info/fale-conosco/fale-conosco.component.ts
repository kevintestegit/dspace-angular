import { Component } from '@angular/core';

import { ThemedFeedbackFormComponent } from '../feedback/feedback-form/themed-feedback-form.component';

@Component({
  selector: 'ds-fale-conosco',
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.scss'],
  imports: [
    ThemedFeedbackFormComponent,
  ],
})
/**
 * Componente público de contato — não requer login.
 */
export class FaleConoscoComponent {
}
