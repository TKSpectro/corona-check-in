import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(public t: TranslateService, private titleService: Title) {}

  setTitle(title: string) {
    const branding = environment.titleBrand;
    this.titleService.setTitle((title ? title + ' | ' : '') + branding);
  }
}
