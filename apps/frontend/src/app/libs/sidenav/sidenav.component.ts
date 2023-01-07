import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AdminService } from '../../auth/admin/admin.service';

@Component({
  selector: 'ccn-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnDestroy {
  fillerNav = Array.from({ length: 7 }, (_, i) => `Nav Item ${i + 1}`);
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;
  adminService: AdminService;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    adminService: AdminService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
    this.adminService = adminService;
  }

  public toggleSideNav(toggleSideNav: boolean): void {
    this.isExpanded = toggleSideNav;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
