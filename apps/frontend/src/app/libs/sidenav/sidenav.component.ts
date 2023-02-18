import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';

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
  isLoggedIn = false;
  langSelect = new FormControl(this.t.currentLang);
  subscription: Subscription[] = [];
  isSignup = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    adminService: AdminService,
    public t: TranslateService,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
    this.adminService = adminService;
    this.isLoggedIn = !!this.authService.autoLogin();
  }

  ngOnInit(): void {
    this.subscription.push(
      this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      })
    );
    this.subscription.push(
      this.authService.authStatusSubject.subscribe((status) => {
        this.isSignup = status;
      })
    );
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

  handleLogout() {
    this.profileService.logout();

    this.snackBar.open(this.t.instant('PROFILES.LOGOUT_SUCCESS'), undefined, {
      panelClass: 'snackbar-success',
    });

    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  changeAuthState(status: boolean) {
    this.authService.authStatusSubject.next(status);
  }
}
