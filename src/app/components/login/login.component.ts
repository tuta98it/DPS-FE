import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AppConfigService } from 'src/app/helpers/app-config.service';
import { NotificationService } from 'src/app/helpers/notification.service';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(
    public configService: AppConfigService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private notification: NotificationService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)]],
      password: ['', [Validators.required]],
    });
    this.loadConfig();
  }
  
  ngOnInit(): void {
  
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.isValid) {
            
          } else {
            this.notification.error('Đăng nhập thất bại', res.errors[0].errorMessage);
          }
          console.log(res);
        }
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

  loadConfig() {
    if (this.configService.getConfig().api.baseUrl) {
      this.slogan = this.configService.getConfig().slogan;
    } else {
      this.configService.load().then(() => {
        this.slogan = this.configService.getConfig().slogan;
      });
    }
  }
}
