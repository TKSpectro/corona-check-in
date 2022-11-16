import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'ccn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  name!: string;

  public items!: { id: string; name: string }[];
 
  testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdHVyYm9tZWV0Lnh5eiIsInN1YiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMiIsInJvbGVzIjoidXNlciIsImlhdCI6MTY2ODUzODI0MywiZXhwIjoxNjcxMTMwMjQzfQ.5kGUhp8oWctxBMpA_LQW_uLRzGjuhrRWukooX6siouE';

  constructor(private http: HttpClient) {
    const req = this.http.get<{ id: string; name: string }[]>('/api/items', {
      headers: { Authorization: `Bearer ${this.testJwt}` },
    });

    req.subscribe((items) => {
      this.items = items;
    });
  }

  addItemHandler() {
    this.http
      .post<{ id: string; name: string }>(
        '/api/items',
        {
          name: this.name,
        },
        {
          headers: { Authorization: `Bearer ${this.testJwt}` },
        }
      )
      .subscribe((item) => {
        this.items.push(item);
      });
  }
}
