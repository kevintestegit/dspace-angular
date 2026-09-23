import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../../app/core/breadcrumbs/dso-name.service';
import { RouteService } from '../../../../../app/core/services/route.service';
import { ThemedMediaViewerComponent } from '../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../../../app/item-page/mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageCcLicenseFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { ItemPageDateFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { GeospatialItemPageFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/geospatial/geospatial-item-page-field.component';
import { ItemPageUriFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemComponent } from '../../../../../app/item-page/simple/item-types/shared/item.component';
import { ThemedMetadataRepresentationListComponent } from '../../../../../app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { RelatedItemsComponent } from '../../../../../app/item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ThemedResultsBackButtonComponent } from '../../../../../app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';
import { PcirnDocumentTypePipe } from '../../../../../app/shared/utils/pcirn-document-type.pipe';

const PCIRN_METADATA_LABEL_KEYS = new Set([
  'dc.contributor.author',
  'dc.coverage.temporal',
  'dc.date.accessioned',
  'dc.date.issued',
  'dc.description.abstract',
  'dc.description.provenance',
  'dc.format.extent',
  'dc.identifier.other',
  'dc.identifier.uri',
  'dc.language',
  'dc.publisher',
  'dc.rights',
  'dc.source',
  'dc.subject',
  'dc.title',
  'dc.type',
]);

@Component({
  selector: 'ds-pcirn-document-item',
  styleUrls: ['./pcirn-document-item.component.scss'],
  templateUrl: './pcirn-document-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DsoEditMenuComponent,
    GenericItemPageFieldComponent,
    GeospatialItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageCcLicenseFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageUriFieldComponent,
    MiradorViewerComponent,
    PcirnDocumentTypePipe,
    RelatedItemsComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class PcirnDocumentItemComponent extends ItemComponent {

  @Input() fullView = false;

  copiedValue: string;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    private dsoNameService: DSONameService,
  ) {
    super(routeService, router);
  }

  get documentType(): string | undefined {
    return this.firstValue(['dc.type', 'dcterms.type']);
  }

  get format(): string | undefined {
    return this.firstValue(['dc.format', 'dcterms.medium']);
  }

  get institution(): string | undefined {
    return this.firstValue(['dc.contributor.institution', 'dc.publisher', 'dc.rights.holder']);
  }

  get abstractText(): string | undefined {
    return this.firstValue('dc.description.abstract');
  }

  get descriptionText(): string | undefined {
    return this.firstValue('dc.description');
  }

  get citation(): string | undefined {
    return this.firstValue('dc.identifier.citation');
  }

  get uri(): string | undefined {
    return this.firstValue('dc.identifier.uri');
  }

  get keywords(): string[] {
    return (this.object?.allMetadataValues('dc.subject') || [])
      .map((value) => value?.trim())
      .filter((value) => value);
  }

  get fullMetadata() {
    return this.object?.metadataAsList || [];
  }

  metadataLabelKey(metadataKey: string): string | undefined {
    return PCIRN_METADATA_LABEL_KEYS.has(metadataKey)
      ? `pcirn.item.metadata.${metadataKey}`
      : undefined;
  }

  get itemName(): string {
    return this.dsoNameService.getName(this.object);
  }

  copyValue(value: string): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !value) {
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      this.copiedValue = value;
    }).catch(() => undefined);
  }

  private firstValue(fields: string | string[]): string | undefined {
    const value = this.object?.firstMetadataValue(fields);
    return value?.trim() || undefined;
  }
}
