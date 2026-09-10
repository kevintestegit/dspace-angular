import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Script } from '../../scripts/script.model';
import { ScriptParameter } from '../../scripts/script-parameter.model';
import { ScriptParameterType } from '../../scripts/script-parameter-type.model';
import { ProcessScriptTranslationService } from '../process-script-translation.service';

/**
 * Components that represents a help section for the script use and parameters
 */
@Component({
  selector: 'ds-script-help',
  templateUrl: './script-help.component.html',
  styleUrls: ['./script-help.component.scss'],
  imports: [
    NgTemplateOutlet,
    TranslateModule,
  ],
})
export class ScriptHelpComponent {
  /**
   * The current script to show the help information for
   */
  @Input() script: Script;

  /**
   * The available script parameter types
   */
  parameterTypes = ScriptParameterType;

  constructor(private translationService: ProcessScriptTranslationService) {
  }

  /**
   * Translated display label for the current script
   */
  get label(): string {
    return this.script ? this.translationService.getLabel(this.script) : '';
  }

  /**
   * Translated description for the current script
   */
  get description(): string {
    return this.script ? this.translationService.getDescription(this.script) : '';
  }

  /**
   * Translated description for a given script parameter
   * @param parameter The parameter to translate a description for
   */
  getParameterDescription(parameter: ScriptParameter): string {
    return this.translationService.getParameterDescription(this.script.id, parameter);
  }
}
