import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { REPOSITORY_DOCUMENTS } from './documents.catalog';
import {
  PcirnLinkDocument,
  PcirnLinkDocumentsService,
} from './pcirn-link-documents.service';

/** Public list of the PCIRN regulatory documents. */
@Component({
  selector: 'ds-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class DocumentosComponent {
  protected readonly documents = REPOSITORY_DOCUMENTS;
  protected readonly linkDocuments$: Observable<PcirnLinkDocument[]>;

  constructor(private linkDocuments: PcirnLinkDocumentsService) {
    this.linkDocuments$ = this.linkDocuments.find('Documento institucional');
  }
}
