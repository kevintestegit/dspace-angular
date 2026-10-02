import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ApplicationRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { AuthService } from '../../../../app/core/auth/auth.service';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { ConfigurationDataService } from '../../../../app/core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { EPersonDataService } from '../../../../app/core/eperson/eperson-data.service';
import { PaginationService } from '../../../../app/core/pagination/pagination.service';
import { SuggestionsNotificationComponent } from '../../../../app/notifications/suggestions/notification/suggestions-notification.component';
import { ProfilePageComponent as BaseComponent } from '../../../../app/profile-page/profile-page.component';
import { ProfilePageMetadataFormComponent } from '../../../../app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component';
import { ThemedProfilePageMetadataFormComponent } from '../../../../app/profile-page/profile-page-metadata-form/themed-profile-page-metadata-form.component';
import { ProfilePageResearcherFormComponent } from '../../../../app/profile-page/profile-page-researcher-form/profile-page-researcher-form.component';
import { ProfilePageSecurityFormComponent } from '../../../../app/profile-page/profile-page-security-form/profile-page-security-form.component';
import { AlertComponent } from '../../../../app/shared/alert/alert.component';
import { ErrorComponent } from '../../../../app/shared/error/error.component';
import {
  hasValue,
  isNotEmpty,
} from '../../../../app/shared/empty.util';
import { FormService } from '../../../../app/shared/form/form.service';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { NotificationsService } from '../../../../app/shared/notifications/notifications.service';
import { PaginationComponent } from '../../../../app/shared/pagination/pagination.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';

const normalize = (value: unknown): string => (value === null || value === undefined ? '' : String(value));

@Component({
  selector: 'ds-themed-profile-page',
  styleUrls: ['../../../../app/profile-page/profile-page.component.scss'],
  templateUrl: './profile-page.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    ErrorComponent,
    NgTemplateOutlet,
    PaginationComponent,
    ProfilePageResearcherFormComponent,
    ProfilePageSecurityFormComponent,
    RouterModule,
    SuggestionsNotificationComponent,
    ThemedLoadingComponent,
    ThemedProfilePageMetadataFormComponent,
    TranslateModule,
    VarDirective,
  ],
})
/**
 * PCIRN profile page.
 *
 * Splits the two writes the upstream page bundled into a single button: identity metadata is
 * committed by the pinned action bar, while the password is committed inside its own card.
 * Both actions tell the user whether there is anything to save before they click.
 */
export class ProfilePageComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * True while the metadata form differs from the stored account data
   */
  metadataDirty = false;

  /**
   * True while any password field holds a value
   */
  securityDirty = false;

  private metadataInstance?: ProfilePageMetadataFormComponent;

  private securityForm?: ProfilePageSecurityFormComponent;

  private metadataSub?: Subscription;

  private securitySub?: Subscription;

  private metadataBound?: UntypedFormGroup;

  private securityBound?: UntypedFormGroup;

  constructor(
    authService: AuthService,
    private notifications: NotificationsService,
    private i18n: TranslateService,
    epersonService: EPersonDataService,
    authorizationService: AuthorizationDataService,
    configurationService: ConfigurationDataService,
    dsoNameService: DSONameService,
    paginationService: PaginationService,
    private formService: FormService,
    private appRef: ApplicationRef,
  ) {
    super(authService, notifications, i18n, epersonService, authorizationService, configurationService, dsoNameService, paginationService);
  }

  @ViewChild(ThemedProfilePageMetadataFormComponent)
  set metadataFormRef(ref: ThemedProfilePageMetadataFormComponent) {
    if (hasValue(ref)) {
      ref.compRef$.pipe(
        filter((compRef) => hasValue(compRef)),
        take(1),
      ).subscribe((compRef) => {
        this.metadataInstance = compRef.instance;
      });
    }
  }

  @ViewChild(ProfilePageSecurityFormComponent)
  set securityFormRef(ref: ProfilePageSecurityFormComponent) {
    this.securityForm = ref;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Both forms are created dynamically (one inside the themed wrapper) and the metadata form
   * rebuilds its group after every save, so groups are not available when the view children
   * resolve and they change identity over time. Track the current group instance and rebind
   * whenever it is replaced; never compare against a value captured once.
   */
  ngDoCheck(): void {
    const metadataGroup = this.metadataInstance?.formGroup;
    if (hasValue(metadataGroup) && metadataGroup !== this.metadataBound) {
      this.metadataSub?.unsubscribe();
      this.metadataBound = metadataGroup;
      this.metadataSub = metadataGroup.valueChanges.subscribe(() => this.refreshState());
      setTimeout(() => this.refreshState());
    }
    const securityGroup = this.securityForm?.formGroup;
    if (hasValue(securityGroup) && securityGroup !== this.securityBound) {
      this.securitySub?.unsubscribe();
      this.securityBound = securityGroup;
      this.securitySub = securityGroup.valueChanges.subscribe(() => this.refreshState());
      setTimeout(() => this.refreshState());
    }
  }

  ngOnDestroy(): void {
    [this.metadataSub, this.securitySub].filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Commit the identity metadata only. Invalid input is revealed instead of being reported as
   * "no changes", which is what made the upstream page mislead the user.
   */
  saveMetadata(): void {
    if (!hasValue(this.metadataInstance)) {
      return;
    }
    if (this.metadataInstance.formGroup.invalid) {
      this.revealErrors(this.metadataInstance.formGroup);
      return;
    }
    if (!this.metadataInstance.updateProfile()) {
      this.notifications.warning(
        this.i18n.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.title'),
        this.i18n.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.content'),
      );
    }
    this.refreshState();
  }

  /**
   * Commit the password on its own, so an irreversible credential change is never a side effect of
   * saving a phone number.
   */
  changePassword(): void {
    const group = this.securityForm?.formGroup;
    if (hasValue(group) && group.invalid) {
      this.revealErrors(group);
      return;
    }
    if (!this.updateSecurity()) {
      this.notifications.warning(
        this.i18n.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'warning.no-password.title'),
        this.i18n.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'warning.no-password.content'),
      );
    }
    this.refreshState();
  }

  /**
   * The metadata form is compared against the user object it holds, which the form itself replaces
   * with the server response after a successful save. A failed save therefore keeps the action
   * enabled rather than claiming the data was stored.
   */
  private refreshState(): void {
    const form = this.metadataInstance;
    const group = form?.formGroup;
    const user = form?.user;
    this.metadataDirty = hasValue(group) && hasValue(user) &&
      form.formModel.some((model) =>
        normalize(group.value[model.id]) !== normalize(user.firstMetadataValue(model.name)));

    const security = this.securityForm?.formGroup;
    this.securityDirty = hasValue(security) &&
      ['current-password', 'password', 'passwordrepeat']
        .some((key) => isNotEmpty(security.value[key]));
  }

  /**
   * Mark every control as touched, bring the first offender into view, and run one extra change
   * detection pass. Focus is deliberately not moved: the dynamic form only renders a field's
   * message while that field is unfocused, so focusing it would hide the very message the user
   * needs to read. The fields are already announced through the form's own live region.
   */
  private revealErrors(group: UntypedFormGroup): void {
    this.formService.validateAllFormFields(group);
    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(
        'ds-themed-profile-page input.ng-invalid, ds-themed-profile-page select.ng-invalid, ds-themed-profile-page textarea.ng-invalid',
      );
      if (hasValue(element)) {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      this.appRef.tick();
    });
  }

}
