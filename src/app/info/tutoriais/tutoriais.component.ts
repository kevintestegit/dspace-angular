import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  PcirnLinkDocument,
  PcirnLinkDocumentsService,
} from '../documentos/pcirn-link-documents.service';
import { TUTORIAL_GROUPS } from './tutorials.catalog';

/** Public catalogue of the PCIRN PDF tutorials. */
@Component({
  selector: 'ds-tutoriais',
  templateUrl: './tutoriais.component.html',
  styleUrls: ['./tutoriais.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class TutoriaisComponent {
  protected readonly groups = TUTORIAL_GROUPS;
  protected readonly linkTutorials$: Observable<PcirnLinkDocument[]>;

  constructor(private linkDocuments: PcirnLinkDocumentsService) {
    this.linkTutorials$ = this.linkDocuments.find('Tutorial');
  }
}
