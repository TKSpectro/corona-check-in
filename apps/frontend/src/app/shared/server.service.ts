import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdHVyYm9tZWV0Lnh5eiIsInN1YiI6Ij' +
    'AwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMiIsInJvbGVzIjoidXNlciIsImlhdCI6MTY2ODUzODI' +
    '0MywiZXhwIjoxNjcxMTMwMjQzfQ.5kGUhp8oWctxBMpA_LQW_uLRzGjuhrRWukooX6siouE';

  constructor(private httpClient: HttpClient) {}

  getIncidenceData(): Observable<any> {
    return this.httpClient.get<any>('/api/incidence', {
      headers: { Authorization: `Bearer ${this.testJwt}` },
    });
  }
}
