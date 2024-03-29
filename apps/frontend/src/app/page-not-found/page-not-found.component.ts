import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../shared/title.service';

@Component({
  selector: 'ccn-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    private t: TranslateService,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.t.get('ERROR_404').subscribe((res: string) => {
        this.titleService.setTitle(res);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
