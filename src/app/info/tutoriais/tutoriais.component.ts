import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TUTORIAL_GROUPS } from './tutorials.catalog';

/** Public catalogue of the PCIRN PDF tutorials. */
@Component({
  selector: 'ds-tutoriais',
  templateUrl: './tutoriais.component.html',
  styleUrls: ['./tutoriais.component.scss'],
  imports: [
    TranslateModule,
  ],
})
export class TutoriaisComponent {
  protected readonly groups = TUTORIAL_GROUPS;
}
