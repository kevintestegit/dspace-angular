import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BrevoEmailLogDataService } from './brevo-email-log-data.service';

interface BrevoEmailEvent {
  date: string;
  email: string;
  event: string;
  from?: string;
  messageId: string;
  reason?: string;
  tag?: string;
  templateId?: number;
}

interface BrevoEmailContent {
  body?: string;
  date?: string;
  email?: string;
  events?: { name: string; time: string }[];
  subject?: string;
  templateId?: number;
  attachmentCount?: number;
}

@Component({
  selector: 'ds-admin-email-logs',
  templateUrl: './admin-email-logs.component.html',
  styleUrls: ['./admin-email-logs.component.scss'],
  imports: [CommonModule, TranslateModule, NgbModalModule],
})
export class AdminEmailLogsComponent implements OnInit {
  events: BrevoEmailEvent[] = [];
  selectedEmail: BrevoEmailContent;
  emailPreview: SafeHtml;
  @ViewChild('emailDetailsModal') emailDetailsModal: TemplateRef<unknown>;
  days = 30;
  offset = 0;
  hasMore = false;
  loading = false;
  loadingMore = false;
  detailsLoading = false;
  selectedMessageId: string;
  resending = false;
  resendSuccess = false;
  resendError = false;
  detailsError = false;
  loadMoreError = false;
  error = false;

  constructor(
    private emailLogService: BrevoEmailLogDataService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.offset = 0;
    this.loading = true;
    this.error = false;
    this.detailsError = false;
    this.loadMoreError = false;
    this.selectedEmail = undefined;
    this.emailLogService.getEvents(this.days).subscribe({
      next: (response) => this.zone.run(() => {
        this.events = response.statusCode === 200 ? response.payload.events || [] : [];
        this.hasMore = this.events.length === 100;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }),
      error: () => this.zone.run(() => {
        this.events = [];
        this.error = true;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }),
    });
  }

  setDays(days: string): void {
    this.days = Number(days);
    this.loadEvents();
  }

  loadMore(): void {
    this.loadingMore = true;
    const nextOffset = this.offset + 100;
    this.emailLogService.getEvents(this.days, 100, nextOffset).subscribe({
      next: (response) => this.zone.run(() => {
        const nextEvents = response.statusCode === 200 ? response.payload.events || [] : [];
        this.events = [...this.events, ...nextEvents];
        this.offset = nextOffset;
        this.hasMore = nextEvents.length === 100;
        this.loadingMore = false;
        this.loadMoreError = false;
        this.changeDetectorRef.markForCheck();
      }),
      error: () => this.zone.run(() => {
        this.loadMoreError = true;
        this.loadingMore = false;
        this.changeDetectorRef.markForCheck();
      }),
    });
  }

  showEmail(event: BrevoEmailEvent): void {
    if (!event.messageId) {
      return;
    }
    this.detailsLoading = true;
    this.detailsError = false;
    this.selectedEmail = undefined;
    this.emailPreview = undefined;
    this.selectedMessageId = event.messageId;
    this.resendSuccess = false;
    this.resendError = false;
    this.modalService.open(this.emailDetailsModal, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
    this.emailLogService.getEmailContent(event.messageId).subscribe({
      next: (response) => this.zone.run(() => {
        this.selectedEmail = response.statusCode === 200 ? response.payload as BrevoEmailContent : undefined;
        this.detailsError = !this.selectedEmail;
        if (this.selectedEmail?.body) {
          const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'; font-src data:;">';
          const source = /<head\b[^>]*>/i.test(this.selectedEmail.body)
            ? this.selectedEmail.body.replace(/<head\b[^>]*>/i, (head) => `${head}${csp}`)
            : `<!doctype html><html><head>${csp}</head><body>${this.selectedEmail.body}</body></html>`;
          this.emailPreview = this.sanitizer.bypassSecurityTrustHtml(source);
        }
        this.detailsLoading = false;
        this.changeDetectorRef.markForCheck();
      }),
      error: () => this.zone.run(() => {
        this.detailsError = true;
        this.detailsLoading = false;
        this.changeDetectorRef.markForCheck();
      }),
    });
  }

  canResend(email: BrevoEmailContent): boolean {
    return !!email.email && !!email.subject && !!email.body && !email.attachmentCount;
  }

  resendEmail(): void {
    if (!this.selectedMessageId || !this.selectedEmail || !this.canResend(this.selectedEmail) || this.resending) {
      return;
    }
    const confirmation = this.translate.instant('admin.email-logs.resend-confirm', {
      recipient: this.selectedEmail.email,
    });
    if (!window.confirm(confirmation)) {
      return;
    }

    this.resending = true;
    this.resendSuccess = false;
    this.resendError = false;
    this.emailLogService.resendEmail(this.selectedMessageId).subscribe({
      next: () => this.zone.run(() => {
        this.resending = false;
        this.resendSuccess = true;
        this.changeDetectorRef.markForCheck();
      }),
      error: () => this.zone.run(() => {
        this.resending = false;
        this.resendError = true;
        this.changeDetectorRef.markForCheck();
      }),
    });
  }
}
