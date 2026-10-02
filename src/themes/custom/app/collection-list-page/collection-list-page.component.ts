import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionListPageComponent as BaseComponent } from '../../../../app/collection-list-page/collection-list-page.component';

@Component({
  selector: 'ds-themed-collection-list-page',
  templateUrl: './collection-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class CollectionListPageComponent extends BaseComponent {
  protected readonly categories = [
    { configuration: 'pcirnNormas', title: 'pcirnNormas.search.results.head', icon: 'fa-file-signature' },
    { configuration: 'pcirnPops', title: 'pcirnPops.search.results.head', icon: 'fa-clipboard-list' },
    { configuration: 'pcirnPap', title: 'pcirnPap.search.results.head', icon: 'fa-folder-open' },
    { configuration: 'pcirnGuiasManuais', title: 'pcirnGuiasManuais.search.results.head', icon: 'fa-book-open' },
    { configuration: 'pcirnNotasTecnicas', title: 'pcirnNotasTecnicas.search.results.head', icon: 'fa-note-sticky' },
    { configuration: 'pcirnRelatorios', title: 'pcirnRelatorios.search.results.head', icon: 'fa-chart-column' },
    { configuration: 'pcirnMemoriaInstitucional', title: 'pcirnMemoriaInstitucional.search.results.head', icon: 'fa-landmark' },
  ];
}
