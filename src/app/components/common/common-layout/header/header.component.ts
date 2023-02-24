import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AuthService } from 'src/app/services/auth.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    // animation triggers go here
    trigger('openClose', [
      state('open', style({
        top: 0,
      })),
      state('close', style({
        top: '-3.5rem',
      })),
      transition('open => close', [
        animate('1s')
      ]),
      transition('close => open', [
        animate('0.25s')
      ]),
    ]),
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  LAYOUT = Constants.LAYOUT
  LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
  layoutConfig = '';
  profileMenuItems!: MenuItem[];
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;
  @Output() onSelectLayout = new EventEmitter<any>();
  @Input() selectedLayout = Constants.LAYOUT.FULL;

  private _isShowViewer: boolean = false;

  get isShowViewer(): boolean {
      return this._isShowViewer;
  }
  @Input() set isShowViewer(value: boolean) {
      if (value !== this._isShowViewer) {
          this._isShowViewer = value;
          if(!value)
            this.isOpen = true;
          else {
            this.isOpen = true;
            setTimeout(() => {
              this.isOpen = false;
            }, 1500);
          }
      }
  }

  // @Input() isShowViewer = false;
  @Output() isShowViewerChange = new EventEmitter<any>();
  @Output() toggleShowSupportLabeling = new EventEmitter<any>();
  visibleNotificationPanel = false;

  //for open in absolute mode (in viewer)
  isOpen = true;

  constructor(
    private router: Router,
    public configService: AppConfigService,
    private authState: AuthStateService,
    private authService: AuthService,
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
    this.layoutConfig = this.configService.getConfig().layout;
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }

  signOut() {
    this.authService.logout().subscribe((data) => {
      localStorage.removeItem(StorageKeys.TOKEN);
      localStorage.removeItem(StorageKeys.USER);
      this.authState.dispatch(null);
      this.router.navigate(['/login']);
    })
  }

  onHover() {
    if(!this.isOpen)
      this.isOpen = true;
  }

  onLeave() {
    if(this.isOpen)
      this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
