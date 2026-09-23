import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { Context } from '../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { PublicationComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/publication/publication.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { PcirnDocumentItemComponent } from '../../../pcirn-document-item/pcirn-document-item.component';

@listableObjectComponent('Publication', ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-publication',
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PcirnDocumentItemComponent,
  ],
})
export class PublicationComponent extends BaseComponent {
}
