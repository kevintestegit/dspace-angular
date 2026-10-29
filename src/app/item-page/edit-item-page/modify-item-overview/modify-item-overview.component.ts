import { KeyValuePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { Item } from '../../../core/shared/item.model';
import { MetadataMap } from '../../../core/shared/metadata.models';

@Component({
  selector: 'ds-modify-item-overview',
  templateUrl: './modify-item-overview.component.html',
  imports: [
    KeyValuePipe,
    TranslateModule,
  ],
})
/**
 * Component responsible for rendering a table containing the metadatavalues from the to be edited item
 */
export class ModifyItemOverviewComponent implements OnChanges  {

  @Input() item: Item;
  metadata: MetadataMap;

  constructor(private translateService: TranslateService) {}

  metadataLabelKey(metadataKey: string): string {
    const labelKey = `pcirn.item.metadata.${metadataKey}`;
    return this.translateService.instant(labelKey) === labelKey ? metadataKey : labelKey;
  }

  ngOnChanges(): void {
    this.metadata = this.item?.metadata;
  }
}
