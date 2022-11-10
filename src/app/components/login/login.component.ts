import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Constants } from 'src/app/shared/constants/constants';
import { AuthService } from 'src/app/services/auth.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
const nonWhiteSpaceRegExp: RegExp = new RegExp("\\S");
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  slogan = {
    content: '',
    author: ''
  }
  loading = false;
  constructor(
    public configService: AppConfigService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authState: AuthStateService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)]],
      password: ['', [Validators.required]],
    });
    this.slogan = this.configService.getConfig().slogan;
  }
  
  ngOnInit(): void {
  
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.isValid) {
            localStorage.setItem(Constants.TOKEN, res.jsonData.value);
            localStorage.setItem(Constants.USER, JSON.stringify(res.jsonData));
            this.authState.dispatch(res.jsonData);
            let returnUrl = '';
            if (this.route.snapshot.queryParams['returnUrl']) {
              returnUrl = this.route.snapshot.queryParams['returnUrl'];
            }
            this.router.navigate([returnUrl]);
          }
        }
      }).add(() => {
        this.loading = false;
      });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
