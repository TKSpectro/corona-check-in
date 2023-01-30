import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../auth/admin/admin.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ccn-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;
  adminService: AdminService;
  isLogged = false;
  langSelect = new FormControl(this.t.currentLang);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    adminService: AdminService,
    public t: TranslateService,
    private authService: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
    this.adminService = adminService;
    this.isLogged = !!this.authService.autoLogin();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLogged) => {
      this.isLogged = isLogged;
    });
  }

  public toggleSideNav(toggleSideNav: boolean): void {
    this.isExpanded = toggleSideNav;
  }

  handleLanguageChange() {
    if (this.langSelect.value) {
      this.t.use(this.langSelect.value);
      localStorage.setItem('ccn_lang', this.langSelect.value);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
