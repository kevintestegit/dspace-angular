import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dsPcirnDocumentType',
  standalone: true,
})
export class PcirnDocumentTypePipe implements PipeTransform {

  constructor(protected translate: TranslateService) {
  }

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }

    // Try direct key first
    const directKey = `pcirn.document-type.${trimmed}`;
    const directTranslation = this.translate.instant(directKey);
    if (directTranslation !== directKey) {
      return directTranslation;
    }

    // Normalize: uppercase and replace spaces with underscores
    const normalizedKey = `pcirn.document-type.${trimmed.replace(/\s+/g, '_').toUpperCase()}`;
    const normalizedTranslation = this.translate.instant(normalizedKey);
    if (normalizedTranslation !== normalizedKey) {
      return normalizedTranslation;
    }

    // Normalize unaccented alphanumeric: remove accents and special chars
    const unaccented = trimmed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanKey = `pcirn.document-type.${unaccented.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase()}`;
    if (cleanKey !== normalizedKey) {
      const cleanTranslation = this.translate.instant(cleanKey);
      if (cleanTranslation !== cleanKey) {
        return cleanTranslation;
      }
    }

    return trimmed;
  }

}
