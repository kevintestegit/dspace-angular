import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TypeBadgeComponent as BaseComponent } from 'src/app/shared/object-collection/shared/badges/type-badge/type-badge.component';

import { Item } from 'src/app/core/shared/item.model';
import { PcirnDocumentTypePipe } from 'src/app/shared/utils/pcirn-document-type.pipe';

@Component({
  selector: 'ds-themed-type-badge',
  // styleUrls: ['./type-badge.component.scss'],
  templateUrl: './type-badge.component.html',
  imports: [
    PcirnDocumentTypePipe,
    TranslateModule,
  ],
})
/**
 * Renders the document type (dc.type, e.g. LEI, PORTARIA, DECRETO) instead of the generic DSO type
 */
export class TypeBadgeComponent extends BaseComponent {

  get documentType(): string {
    return this.object instanceof Item ? this.object.firstMetadataValue('dc.type') : undefined;
  }
}
