import { Component, inject , OnInit} from '@angular/core';
import { SalarydataService } from '../service/salarydata.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Allowance{
  name: string;
  amount: number;
  isFixedWage: boolean;
}

interface MonthPayroll{
  targetMonth: string;
  fixedWages: Allowance[];
  variableWages: Allowance[];
  transportationFee: number;
}

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [ FormsModule, RouterLink ],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss'
})
export class SalaryComponent implements OnInit {
  private salaryData = inject(SalarydataService);
  private router = inject(Router);


  inputAllowanceName: string = "";
  inputAllowanceAmount: string = "";
  inputIsFixedWages: boolean = false;
  inputPayMonth: string ="";
  inputPaytransportFee: number | null =null;

  isAdding: boolean = false;

  monthPayroll: MonthPayroll = {
    targetMonth: '',
    fixedWages:[{name: '基本給', amount: 0, isFixedWage: true}],
    variableWages: [{name: '残業代', amount: 0, isFixedWage: false}],
    transportationFee:0
  };

  currentUserId : string = "";
  currentCompanyId : string = "";


  ngOnInit(){
    this.currentUserId  = localStorage.getItem('current_user_id') || "";
    if(this.currentUserId === "admin"){
      const userDataString = localStorage.getItem('current_user_data');
      if(userDataString){
        const userData = JSON.parse(userDataString);
        this.currentUserId = userData.employeeId;
      };
    }
    this.currentCompanyId = localStorage.getItem('current_company_id') || "";
    console.log('user',this.currentUserId);
    console.log('company', this.currentCompanyId);
  }


  async saveSalary(){

    this.monthPayroll.targetMonth = this.inputPayMonth;
    this.monthPayroll.transportationFee = this.inputPaytransportFee || 0;

    await this.salaryData.saveSalaryData(this.currentCompanyId, this.currentUserId, {
      ...this.monthPayroll
    });

    this.router.navigate(['/admin-page']);
  }

  addAllowance(){
    if(!this.inputAllowanceName || !this.inputAllowanceAmount)return;
  
    const newAllowance: Allowance = {
      name: this.inputAllowanceName,
      amount: Number(this.inputAllowanceAmount),
      isFixedWage: this.inputIsFixedWages
    };

    if(newAllowance.isFixedWage){
      this.monthPayroll.fixedWages.push(newAllowance);
    }
    else{
      this.monthPayroll.variableWages.push(newAllowance);
    }

    this.inputAllowanceAmount = "";
    this.inputAllowanceName = "";
    this.inputIsFixedWages = false;
    
  }




}
