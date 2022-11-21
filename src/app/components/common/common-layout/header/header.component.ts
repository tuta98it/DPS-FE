import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  LAYOUT = Constants.LAYOUT
  profileMenuItems!: MenuItem[];
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;
  @Output() onSelectLayout = new EventEmitter<any>();
  @Input() selectedLayout = Constants.LAYOUT.FULL;
  
  @Input() isShowViewer = false;
  @Output() isShowViewerChange = new EventEmitter<any>();

  constructor(
    private router: Router,
    private authState: AuthStateService,
  ) {
    this.profileMenuItems = [
      {
        label: 'Đăng xuất',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.signOut()
      }
    ];
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }

  signOut() {
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.USER);
    this.authState.dispatch(null);
    this.router.navigate(['/login']);
  }
}
