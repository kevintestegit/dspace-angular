import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RawRestResponse } from '../../core/dspace-rest/raw-rest-response.model';
import { BrevoEmailLogDataService } from './brevo-email-log-data.service';
import { AdminEmailLogsComponent } from './admin-email-logs.component';

describe('AdminEmailLogsComponent', () => {
  let fixture: ComponentFixture<AdminEmailLogsComponent>;
  let comp: AdminEmailLogsComponent;
  let emailLogService: jasmine.SpyObj<BrevoEmailLogDataService>;

  beforeEach(async () => {
    emailLogService = jasmine.createSpyObj<BrevoEmailLogDataService>('BrevoEmailLogDataService', [
      'getEvents',
      'getEmailContent',
    ]);
    emailLogService.getEvents.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: {
        events: [{
          date: '2026-09-22T10:00:00Z',
          email: 'user@example.org',
          event: 'delivered',
          messageId: '<message@example.org>',
        }],
      },
    } as RawRestResponse));
    emailLogService.getEmailContent.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: {
        subject: 'Bem-vindo',
        body: '<p>Conteúdo</p>',
        events: [{ name: 'delivered', time: '2026-09-22T10:00:00Z' }],
      },
    } as RawRestResponse));

    await TestBed.configureTestingModule({
      imports: [AdminEmailLogsComponent, TranslateModule.forRoot()],
      providers: [{ provide: BrevoEmailLogDataService, useValue: emailLogService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEmailLogsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads events and shows message content on demand', () => {
    expect(emailLogService.getEvents).toHaveBeenCalledWith(30);
    expect(fixture.nativeElement.textContent).toContain('user@example.org');

    const row: HTMLTableRowElement = fixture.nativeElement.querySelector('.email-event');
    row.click();
    fixture.detectChanges();

    expect(emailLogService.getEmailContent).toHaveBeenCalledWith('<message@example.org>');
    expect(comp.selectedEmail.subject).toBe('Bem-vindo');
    expect(String((comp.emailPreview as any).changingThisBreaksApplicationSecurity)).toContain('Conteúdo');
  });
});
