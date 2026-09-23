import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Bitstream } from '../../../../../../../app/core/shared/bitstream.model';
import { FileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-item-page-file-section',
  styleUrls: ['./file-section.component.scss'],
  templateUrl: './file-section.component.html',
  animations: [slideSidebarPadding],
  imports: [
    CommonModule,
    ThemedFileDownloadLinkComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class FileSectionComponent extends BaseComponent {

  fileExtension(file: Bitstream): string | undefined {
    const name = this.dsoNameService.getName(file) || '';
    const extension = name.includes('.') ? name.split('.').pop() : undefined;
    return extension?.trim().toUpperCase() || undefined;
  }
}
