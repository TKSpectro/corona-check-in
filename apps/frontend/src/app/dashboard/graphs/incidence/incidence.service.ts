import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidenceService {
  constructor(private httpClient: HttpClient) {}

  testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdHVyYm9tZWV0Lnh5eiIsInN1YiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMiIsInJvbGVzIjoidXNlciIsImlhdCI6MTY2ODUzODI0MywiZXhwIjoxNjcxMTMwMjQzfQ.5kGUhp8oWctxBMpA_LQW_uLRzGjuhrRWukooX6siouE';

  getIncidenceData() {
    return this.httpClient.get('/api/incidence', {
      headers: { Authorization: `Bearer ${this.testJwt}` },
    });
  }
}
