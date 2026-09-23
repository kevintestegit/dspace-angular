import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { RestRequestMethod } from '../../core/data/rest-request-method';
import { DspaceRestService } from '../../core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from '../../core/dspace-rest/raw-rest-response.model';

@Injectable({ providedIn: 'root' })
export class BrevoEmailLogDataService {
  private readonly endpoint: string;

  constructor(@Inject(APP_CONFIG) appConfig: AppConfig, private restService: DspaceRestService) {
    this.endpoint = `${appConfig.rest.baseUrl}/api/admin/email-logs`;
  }

  getEvents(days: number, limit = 100, offset = 0): Observable<RawRestResponse> {
    return this.restService.get(`${this.endpoint}/events?days=${days}&limit=${limit}&offset=${offset}`);
  }

  getEmailContent(messageId: string): Observable<RawRestResponse> {
    return this.restService.get(`${this.endpoint}/content?messageId=${encodeURIComponent(messageId)}`);
  }

  resendEmail(messageId: string): Observable<RawRestResponse> {
    return this.restService.request(
      RestRequestMethod.POST,
      `${this.endpoint}/resend?messageId=${encodeURIComponent(messageId)}`,
    );
  }
}
