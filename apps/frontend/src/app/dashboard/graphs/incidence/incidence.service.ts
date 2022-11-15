import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidenceService {
  constructor(private httpClient: HttpClient) {}

  testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdHVyYm9tZWV0Lnh5eiIsInN1YiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMiIsInJvbGVzIjoidXNlciIsImlhdCI6MTY2ODUyMDMzNywiZXhwIjoxNjcxMTEyMzM3fQ.E0hOWWgpRBR4rn4_0Xpp3nmmXGG2-pXTpy0nOSB3_zM';

  getIncidenceData() {
    return this.httpClient.get('/api/incidence', {
      headers: { Authorization: `Bearer ${this.testJwt}` },
    });
  }
}
