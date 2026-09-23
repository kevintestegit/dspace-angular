import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';

export class ValidateEmailNotTaken {

  /**
   * This method will create the validator with the ePersonDataService requested from component
   * @param ePersonDataService the service with DI in the component that this validator is being utilized.
   */
  static createValidator(ePersonDataService: EPersonDataService) {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return ePersonDataService.getEPersonByEmail(control.value)
        .pipe(
          getFirstCompletedRemoteData(),
          map(res => {
            return res.hasSucceeded && res.payload ? { emailTaken: true } : null;
          }),
          catchError(() => of(null)),
        );
    };
  }
}
