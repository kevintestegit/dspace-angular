import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { MenuItemType } from '../menu-item-type.model';
import { BrevoEmailLogsMenuProvider } from './brevo-email-logs.menu';

describe('BrevoEmailLogsMenuProvider', () => {
  let provider: BrevoEmailLogsMenuProvider;
  const authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(of(true));
    TestBed.configureTestingModule({
      providers: [
        BrevoEmailLogsMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(BrevoEmailLogsMenuProvider);
  });

  it('shows the email logs link to site administrators', (done) => {
    provider.getSections().subscribe((sections) => {
      expect(sections[0].visible).toBeTrue();
      expect(sections[0].model).toEqual({
        type: MenuItemType.LINK,
        text: 'menu.section.email_logs',
        link: '/admin/email-logs',
      });
      done();
    });
  });
});
