import {
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Observable,
  firstValueFrom,
  of,
  throwError,
} from 'rxjs';

import { RemoteData } from '../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { ValidateEmailNotTaken } from './email-taken.validator';

describe('ValidateEmailNotTaken', () => {
  const control = new FormControl('new@example.com');

  it('returns no validation error when the email lookup returns a failed response', async () => {
    const service = {
      getEPersonByEmail: () => of({ hasCompleted: true, hasSucceeded: false } as RemoteData<EPerson>),
    } as unknown as EPersonDataService;
    const validator = ValidateEmailNotTaken.createValidator(service);

    const validationResult = validator(control) as Observable<ValidationErrors | null>;

    await expectAsync(firstValueFrom(validationResult)).toBeResolvedTo(null);
  });

  it('returns no validation error when the email lookup errors', async () => {
    const service = {
      getEPersonByEmail: () => throwError(() => new Error('lookup failed')),
    } as unknown as EPersonDataService;
    const validator = ValidateEmailNotTaken.createValidator(service);

    const validationResult = validator(control) as Observable<ValidationErrors | null>;

    await expectAsync(firstValueFrom(validationResult)).toBeResolvedTo(null);
  });
});
