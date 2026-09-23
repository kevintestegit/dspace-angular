import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { Context } from '../../../../../../../app/core/shared/context.model';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { ItemComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/shared/item.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { PcirnDocumentItemComponent } from '../../../pcirn-document-item/pcirn-document-item.component';

@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-untyped-item',
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PcirnDocumentItemComponent,
  ],
})
export class UntypedItemComponent extends BaseComponent {
}
