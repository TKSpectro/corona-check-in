import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../shared/title.service';

@Component({
  selector: 'ccn-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
})
export class ImprintComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    private t: TranslateService,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.t.get('IMPRINT').subscribe((res: string) => {
        this.titleService.setTitle(res);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
