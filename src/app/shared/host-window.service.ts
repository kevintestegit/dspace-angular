import { Injectable } from '@angular/core';
import {
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import {
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { hasValue } from './empty.util';
import { CSSVariableService } from './sass-helper/css-variable.service';
import { HostWindowState } from './search/host-window.reducer';

export enum WidthCategory {
  XS = 0,
  SM = 1,
  MD = 2,
  LG = 3,
  XL = 4,
}

export const maxMobileWidth = WidthCategory.SM;

const hostWindowStateSelector = (state: AppState) => state.hostWindow;
const widthSelector = createSelector(hostWindowStateSelector, (hostWindow: HostWindowState) => hostWindow.width);

@Injectable({ providedIn: 'root' })
export class HostWindowService {
  constructor(
    private store: Store<AppState>,
    private variableService: CSSVariableService,
  ) {
  }

  private getWidthObs(): Observable<number> {
    return this.store.pipe(
      select(widthSelector),
      filter((width) => hasValue(width)),
    );
  }

  /**
   * Returns the viewport category using the current theme's breakpoints.
   */
  get widthCategory(): Observable<WidthCategory> {
    return observableCombineLatest([
      this.getWidthObs(),
      this.variableService.getAllVariables(),
    ]).pipe(
      map(([width, variables]) => {
        const smMin = parseInt(variables['--bs-sm'], 10);
        const mdMin = parseInt(variables['--bs-md'], 10);
        const lgMin = parseInt(variables['--bs-lg'], 10);
        const xlMin = parseInt(variables['--bs-xl'], 10);
        if (width < smMin) {
          return WidthCategory.XS;
        } else if (width >= smMin && width < mdMin) {
          return WidthCategory.SM;
        } else if (width >= mdMin && width < lgMin) {
          return WidthCategory.MD;
        } else if (width >= lgMin && width < xlMin) {
          return WidthCategory.LG;
        } else {
          return WidthCategory.XL;
        }
      }),
      distinctUntilChanged(),
    );
  }

  isXs(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XS),
      distinctUntilChanged(),
    );
  }

  isSm(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.SM),
      distinctUntilChanged(),
    );
  }

  isMd(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.MD),
      distinctUntilChanged(),
    );
  }

  isLg(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.LG),
      distinctUntilChanged(),
    );
  }

  isXl(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XL),
      distinctUntilChanged(),
    );
  }

  is(exactWidthCat: WidthCategory): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === exactWidthCat),
      distinctUntilChanged(),
    );
  }

  isIn(widthCatArray: [WidthCategory]): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCatArray.includes(widthCat)),
      distinctUntilChanged(),
    );
  }

  isUpTo(maxWidthCat: WidthCategory): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat <= maxWidthCat),
      distinctUntilChanged(),
    );
  }

  isMobile(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat <= maxMobileWidth),
      distinctUntilChanged(),
    );
  }

  isDesktop(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat > maxMobileWidth),
      distinctUntilChanged(),
    );
  }

  isXsOrSm(): Observable<boolean> {
    return observableCombineLatest([
      this.isXs(),
      this.isSm(),
    ]).pipe(
      map(([isXs, isSm]) => isXs || isSm),
      distinctUntilChanged(),
    );
  }
}
