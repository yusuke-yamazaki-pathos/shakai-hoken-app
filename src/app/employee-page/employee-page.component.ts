import { Component,OnInit,inject } from '@angular/core';
import { LoginService } from '../service/login.service';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeDialogService } from '../service/employee-dialog.service';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [RouterLink, MatDialogModule],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.scss'
})
export class EmployeePageComponent  implements OnInit{

  private loginService = inject(LoginService);
  private employeeDialogService = inject(EmployeeDialogService);
  private companyService = inject(CompanyService);

  currentUserId: string  = localStorage.getItem('current_user_id') ?? "";
  currentCompanyId : string  = localStorage.getItem('current_company_id') ?? "";
  userData: any = null;

  ngOnInit(){

    this.loadUserData();

  }

  async loadUserData(){
    this.userData = await this.loginService.getUserData(this.currentCompanyId, this.currentUserId);
    if(this.userData){
      localStorage.setItem('current_user_data', JSON.stringify(this.userData));
    }
  }


 async openEditDialog(){

    await this.employeeDialogService.openEdit(this.currentCompanyId, this.userData);
    await this.loadUserData();
    
  }
  
}
