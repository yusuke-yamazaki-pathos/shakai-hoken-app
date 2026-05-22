import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-output-page',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './output-page.component.html',
  styleUrl: './output-page.component.scss'
})
export class OutputPageComponent implements OnInit {
  private loginService = inject(LoginService);
  private router = inject(Router);
  companyId : string = "";
  userId : string = "";

  ngOnInit (): void{
    this.companyId = localStorage.getItem('current_company_id') || "";
    this.userId = localStorage.getItem('current_user_id') || "";

    console.log('組織ID',this.companyId);
    console.log('ログイン中ユーザー', this.userId);

    if(this.userId === "admin"){
      this.router.navigate(['/admin-page']);
    }
    else{
      this.router.navigate(['employee-page']);
    }

  }

}
