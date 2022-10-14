import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  valCheck: string[] = ['remember'];

  password!: string;

  constructor(public layoutService: LayoutService) { }

  ngOnInit(): void {
  }

}
