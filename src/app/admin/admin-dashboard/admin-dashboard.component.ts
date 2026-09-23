import { Component, OnInit } from '@angular/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { LinkMenuItemModel } from '../../shared/menu/menu-item/models/link.model';
import { OnClickMenuItemModel } from '../../shared/menu/menu-item/models/onclick.model';
import { MenuItemType } from '../../shared/menu/menu-item-type.model';
import { MenuID } from '../../shared/menu/menu-id.model';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { MenuService } from '../../shared/menu/menu.service';

export interface AdminDashboardGroup {
  section: MenuSection;
  items: MenuSection[];
}

@Component({
  selector: 'ds-base-admin-dashboard',
  template: '',
})
export class AdminDashboardComponent implements OnInit {

  groups$: Observable<AdminDashboardGroup[]>;

  constructor(
    private menuService: MenuService,
  ) {
  }

  ngOnInit(): void {
    this.menuService.showMenu(MenuID.ADMIN);
    this.groups$ = this.menuService.getMenuTopSections(MenuID.ADMIN).pipe(
      switchMap((sections) => sections.length === 0
        ? of([])
        : combineLatest(sections.map((section) =>
          this.menuService.getSubSectionsByParentID(MenuID.ADMIN, section.id).pipe(
            map((items) => ({ section, items })),
          ),
        )),
      ),
    );
  }

  trackGroup(_: number, group: AdminDashboardGroup): string {
    return group.section.id;
  }

  trackSection(_: number, section: MenuSection): string {
    return section.id;
  }

  getText(section: MenuSection): string {
    return 'text' in section.model ? section.model.text : '';
  }

  getLink(section: MenuSection): string | undefined {
    return section.model.type === MenuItemType.LINK
      ? (section.model as LinkMenuItemModel).link
      : undefined;
  }

  isAction(section: MenuSection): boolean {
    return section.model.type === MenuItemType.ONCLICK;
  }

  execute(section: MenuSection): void {
    if (this.isAction(section)) {
      (section.model as OnClickMenuItemModel).function();
    }
  }
}
