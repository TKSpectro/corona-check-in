import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from './auth/admin/admin.service';
import { AuthService } from './auth/auth.service';
import { SidenavComponent } from './libs';

@Component({
  selector: 'ccn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'frontend';
  isExpanded = false;
  mobileQuery: MediaQueryList;

  @ViewChild(SidenavComponent)
  public sideNavComponent!: SidenavComponent;

  _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private adminService: AdminService,
    private t: TranslateService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    this.t.addLangs(['en', 'de']);
    this.t.setDefaultLang('en');
    const localStoredLang = localStorage.getItem('ccn_lang');
    const browserLang = this.t.getBrowserLang();
    this.t.use(localStoredLang || browserLang || 'en');

    this.authService.autoLogin();
    this.adminService.requestIsAdmin().subscribe();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
    this.sideNavComponent.toggleSideNav(this.isExpanded);
  }
}
