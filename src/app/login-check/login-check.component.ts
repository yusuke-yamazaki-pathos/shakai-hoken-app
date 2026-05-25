import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login-check',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './login-check.component.html',
  styleUrl: './login-check.component.scss'
})
export class LoginCheckComponent implements OnInit {

  private router = inject(Router)

  ngOnInit(){

    const checkLogin : string | null= localStorage.getItem('contract_verified');

    console.log(checkLogin);

    if(checkLogin !== null && checkLogin === 'true'){
      this.router.navigate(['/user-login']);

    }

    else {
      this.router.navigate(['/initial-login']);
    }

  }

 
}
