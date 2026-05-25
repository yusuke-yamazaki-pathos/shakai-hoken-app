import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, collectionData, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CompanyService } from '../service/company.service';
import { LoginService } from '../service/login.service';
import { EmployeeDialogService } from '../service/employee-dialog.service';

interface Employee {

  employeeId?: string;
  name: string;
  age: number;
  monthAvg: number;
  status: string;
  startDate: string;
  gender: string;
  address: string;
  helthStatus: string;
  employeePension: string;
  dependentCount: number;
  dependents: Dependent[];
  pass: string;

}

interface Dependent {
  name: string;
  birthDate: string;
  gender: string;
  relationship: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit{

  employees$!: Observable<Employee[]>;

  private firestore : Firestore = inject(Firestore);
  private companyService = inject(CompanyService);
  private loginService = inject(LoginService);
  private employeeDialogService = inject(EmployeeDialogService);

  currentCompanyId = localStorage.getItem('current_company_id')??'';
  userData: any = null;
  

  ngOnInit(){
    const companyId = localStorage.getItem('current_company_id');
    const userId = localStorage.getItem('current_user_id');

    console.log ('組織ID',companyId);
    console.log('user',userId);

    if(companyId){

      const employeesCollection = collection(this.firestore, 'company', companyId, `employees`);
      this.employees$ = collectionData(employeesCollection,{ idField: 'id'}) as Observable<Employee[]>;

    }
  
  }

  async openEditDialog(emp: Employee){

    await this.employeeDialogService.openEdit(this.currentCompanyId, emp);
    localStorage.setItem('current_user_data', JSON.stringify(emp));
    
  }
  


}
