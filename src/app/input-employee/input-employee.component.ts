import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, collectionData, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CompanyService } from '../service/company.service';
import { LoginService } from '../service/login.service';

interface Employee {

  employeeId?: string;
  name: string;
  age: number;
  monthAvg: number;
  status: string;
  startDate: string;
  gender: string;
  address: string;
  helthStatus: string;//健康保険加入状況（３パターン）
  employmentType: string;
  employeePension: string;//厚生年金加入状況（３パターン）
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
  selector: 'app-input-employee',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AsyncPipe, CommonModule, RouterLink],
  templateUrl: './input-employee.component.html',
  styleUrl: './input-employee.component.scss'
})



export class InputEmployeeComponent  implements OnInit {

  inputName : string = '';
  inputBirthDay: string = "";
  inputAge : number | null = null;
  inputMonthAvg : number | null = null;
  inputStatus : string = '';
  inputStartDate: string = '';
  inputId: string = "";
  inputGender : string = "";
  inputEmploymentType: string = "";
  inputAddress: string = "";
  helthInsuranceStatus: number | null = null;
  employeesPension: number | null = null;
  dependentCount: number | null = null;
  dependents: Dependent[] = [];
  inputPass: string = "";



  employees$!: Observable<Employee[]>;

  private firestore : Firestore = inject(Firestore);
  private companyService = inject(CompanyService);
  private loginService = inject(LoginService);

  isSaved:boolean = false;

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

  onDependentCountChange(){
    const targetCount = this.dependentCount || 0;
    while(this.dependents.length < targetCount){
      this.dependents.push({
        name: '',
        birthDate:'',
        gender:'女性',
        relationship:'子'
      });
    }
    while (this.dependents.length > targetCount){
      this.dependents.pop();
    }
  }

  async save() {

    const currentCompanyId = localStorage.getItem('current_company_id');

    if(!this.inputName || this.inputAge === null){
      alert('名前と年齢を入力してください');
      return;
    }

    try{
      
      this.inputPass = this.inputId;
      await this.companyService.saveEmployees(currentCompanyId,{

        name: this.inputName,
        age: this.inputAge,
        monthAvg: this.inputMonthAvg,
        status: this.inputStatus,
        startDate: this.inputStartDate,
        employeeId: this.inputId,
        gender: this.inputGender,
        address: this.inputAddress,
        helthStatus: this.helthInsuranceStatus,
        employeePension: this.employeesPension,
        dependentCount: this.dependentCount,
        dependents: this.dependents,
        pass: this.inputPass,
        employmentType: this.inputEmploymentType

      });

      alert(`保存に成功しました！登録名:${this.inputName}(ID: ${this.inputId})`);


      this.inputName = '';
      this.inputAge = null;
      this.inputMonthAvg = null;
      this.inputStatus = '';
      this.inputStartDate = '';
      this.inputId = "";
      this.inputGender = "";
      this.inputAddress = "";
      this.helthInsuranceStatus = null;
      this.employeesPension = null;
      this.dependentCount = null;
      this.dependents = [];

      this.isSaved = true;

    } catch(error: any){
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    }
  }

}
