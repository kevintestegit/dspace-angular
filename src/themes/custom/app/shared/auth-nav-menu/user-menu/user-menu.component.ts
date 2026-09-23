import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { LogOutComponent } from 'src/app/shared/log-out/log-out.component';
import { ThemedCreateItemParentSelectorComponent } from 'src/app/shared/dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import { LinkMenuItemModel } from 'src/app/shared/menu/menu-item/models/link.model';
import { OnClickMenuItemModel } from 'src/app/shared/menu/menu-item/models/onclick.model';
import { MenuItemType } from 'src/app/shared/menu/menu-item-type.model';
import { MenuID } from 'src/app/shared/menu/menu-id.model';
import { MenuSection } from 'src/app/shared/menu/menu-section.model';
import { MenuService } from 'src/app/shared/menu/menu.service';
import { UserSectorsService } from 'src/app/shared/user-sectors/user-sectors.service';

import { Community } from '../../../../../../app/core/shared/community.model';
import { UserMenuComponent as BaseComponent } from '../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';

export interface AdminMenuGroup {
  section: MenuSection;
  items: MenuSection[];
}

@Component({
  selector: 'ds-themed-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [
    AsyncPipe,
    LogOutComponent,
    NgClass,
    RouterLink,
    RouterLinkActive,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class UserMenuComponent extends BaseComponent {

  readonly userSectors = inject(UserSectorsService);
  private readonly menuService = inject(MenuService);
  private readonly modalService = inject(NgbModal);
  readonly administrationAvailable$ = this.menuService.isMenuVisibleWithVisibleSections(MenuID.ADMIN);

  adminMenuOpen = false;
  readonly expandedAdminSections = new Set<string>();

  readonly adminSections$: Observable<AdminMenuGroup[]> = this.menuService.getMenuTopSections(MenuID.ADMIN).pipe(
    switchMap((sections) => sections.length === 0
      ? of([] as AdminMenuGroup[])
      : combineLatest(sections.map((section) =>
        this.menuService.getSubSectionsByParentID(MenuID.ADMIN, section.id).pipe(
          map((items) => ({ section, items })),
        ),
      ))),
  );

  override ngOnInit(): void {
    super.ngOnInit();
    this.authService.isAuthenticated().pipe(take(1)).subscribe((authenticated) => {
      if (authenticated) {
        this.menuService.showMenu(MenuID.ADMIN);
      }
    });
  }

  trackCommunity(_: number, community: Community): string {
    return community.id;
  }

  trackAdminSection(_: number, group: AdminMenuGroup | MenuSection): string {
    return 'section' in group ? group.section.id : group.id;
  }

  get adminMenuInstanceId(): string {
    return this.inExpandableNavbar ? 'mobile' : 'desktop';
  }

  toggleAdminMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.adminMenuOpen = !this.adminMenuOpen;
  }

  toggleAdminSection(section: MenuSection, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.expandedAdminSections.has(section.id)) {
      this.expandedAdminSections.delete(section.id);
    } else {
      this.expandedAdminSections.add(section.id);
    }
  }

  isAdminSectionExpanded(section: MenuSection): boolean {
    return this.expandedAdminSections.has(section.id);
  }

  getAdminSectionText(section: MenuSection): string {
    return 'text' in section.model ? section.model.text : '';
  }

  getAdminSectionLink(section: MenuSection): string | undefined {
    return section.model.type === MenuItemType.LINK
      ? (section.model as LinkMenuItemModel).link
      : undefined;
  }

  isAdminSectionAction(section: MenuSection): boolean {
    return section.model.type === MenuItemType.ONCLICK;
  }

  executeAdminSection(section: MenuSection): void {
    this.onMenuItemClick();
    if (this.isAdminSectionAction(section)) {
      (section.model as OnClickMenuItemModel).function();
    }
  }

  openSubmission(): void {
    this.onMenuItemClick();
    this.modalService.open(ThemedCreateItemParentSelectorComponent);
  }
}
