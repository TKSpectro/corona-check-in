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

  constructor(private http: HttpClient) {
    const req = this.http.get<{ id: string; name: string }[]>('/api/items');

    req.subscribe((items) => {
      this.items = items;
    });
  }

  addItemHandler() {
    this.http
      .post<{ id: string; name: string }>('/api/items', {
        name: this.name,
      })
      .subscribe((item) => {
        this.items.push(item);
      });
  }
}
