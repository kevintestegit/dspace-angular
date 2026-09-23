import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FaleConoscoComponent as BaseComponent } from '../../../../../app/info/fale-conosco/fale-conosco.component';
import { ThemedFeedbackFormComponent } from '../../../../../app/info/feedback/feedback-form/themed-feedback-form.component';

@Component({
  selector: 'ds-themed-fale-conosco',
  styleUrls: ['./fale-conosco.component.scss'],
  templateUrl: './fale-conosco.component.html',
  imports: [
    RouterLink,
    ThemedFeedbackFormComponent,
    TranslateModule,
  ],
})
export class FaleConoscoComponent extends BaseComponent {
  /**
   * Estado visual temporário ao copiar o e-mail oficial
   */
  copiedEmail = false;

  /**
   * Copia o e-mail institucional para a área de transferência do usuário
   */
  copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText('arquivogeral@pci.rn.gov.br').then(() => {
        this.copiedEmail = true;
        setTimeout(() => {
          this.copiedEmail = false;
        }, 2500);
      }).catch(() => {
        // Fallback silencioso caso clipboard seja bloqueado pelo navegador
      });
    }
  }
}

