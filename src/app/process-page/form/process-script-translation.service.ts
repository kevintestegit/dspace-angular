import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Script } from '../scripts/script.model';
import { ScriptParameter } from '../scripts/script-parameter.model';

/**
 * Service that provides localized display metadata for the scripts shown on the
 * "New process" page.
 *
 * The backend serves script and parameter names/descriptions in English (they
 * are not persisted in the DB and have no i18n support). This service looks up
 * optional translations in the active language via a stable key scheme and falls
 * back to the backend values when no translation is available.
 *
 * Key scheme (all under the `process.new.script.<scriptId>` namespace):
 *   - `<scriptId>.label`                          -> display name of the script
 *   - `<scriptId>.description`                    -> description of the script
 *   - `<scriptId>.params.<paramName>.description` -> description of a parameter
 */
@Injectable({ providedIn: 'root' })
export class ProcessScriptTranslationService {

  constructor(private translateService: TranslateService) {
  }

  /**
   * Translate the display label of a script, falling back to its backend name.
   */
  getLabel(script: Script): string {
    return this.translateOrFallback(`process.new.script.${script.id}.label`, script.name);
  }

  /**
   * Translate the description of a script, falling back to the backend description.
   */
  getDescription(script: Script): string {
    return this.translateOrFallback(`process.new.script.${script.id}.description`, script.description);
  }

  /**
   * Translate the description of a script parameter, falling back to the backend description.
   */
  getParameterDescription(scriptId: string, parameter: ScriptParameter): string {
    const key = `process.new.script.${scriptId}.params.${parameter.nameLong || parameter.name}.description`;
    return this.translateOrFallback(key, parameter.description);
  }

  /**
   * Return the translation for `key` when available, otherwise return `fallback`.
   *
   * ngx-translate returns the key itself when no translation exists, so a key
   * that maps to a different value means a translation was found.
   */
  private translateOrFallback(key: string, fallback: string): string {
    const translated = this.translateService.instant(key);
    return translated !== key ? translated : fallback;
  }

}
