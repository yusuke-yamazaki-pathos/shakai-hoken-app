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
  workDays: number;
  absentDays: number;
  paidLeaveDays: number;
  paymentBaseDays: number;
  monthAvg: number;
  totalWages: number;
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
  inputWorkDays: number| null = null;
  inputAbsentDays: number | null = null;
  inputPaidLeaveDays: number | null = null;


  isAdding: boolean = false;

  monthPayroll: MonthPayroll = {
    targetMonth: '',
    fixedWages:[{name: '基本給', amount: 0, isFixedWage: true}],
    variableWages: [{name: '残業代', amount: 0, isFixedWage: false}],
    transportationFee:0,
    workDays:0,
    absentDays: 0,
    paidLeaveDays: 0,
    paymentBaseDays: 0,
    monthAvg: 0,
    totalWages: 0
  };

  currentUserId : string = "";
  currentCompanyId : string = "";
  userData: any = null;


  ngOnInit(){
    this.currentUserId  = localStorage.getItem('current_user_id') || "";
    if(this.currentUserId === "admin"){
      const userDataString = localStorage.getItem('current_user_data');
      if(userDataString){
        this.userData = JSON.parse(userDataString);
        this.currentUserId = this.userData.employeeId;
      };
    }
    this.currentCompanyId = localStorage.getItem('current_company_id') || "";
    console.log('user',this.currentUserId);
    console.log('company', this.currentCompanyId);
  }


  async saveSalary(){

    this.monthPayroll.workDays = this.inputWorkDays || 0;
    this.monthPayroll.absentDays = this.inputAbsentDays || 0;
    this.monthPayroll.paidLeaveDays = this.inputPaidLeaveDays || 0;
    this.monthPayroll.targetMonth = this.inputPayMonth.replace('-','');
    this.monthPayroll.transportationFee = this.inputPaytransportFee || 0;
    this.monthPayroll.paymentBaseDays = this.calculatePaymentBaseDays();
    this.monthPayroll.totalWages = this.calculateTotalWages();
    this.monthPayroll.monthAvg = this.userData.monthAvg;

    if(this.monthPayroll.monthAvg === null){
      this.monthPayroll.monthAvg = this.monthPayroll.totalWages;
      this.userData.monthAvg = this.monthPayroll.monthAvg;
    }

    await this.salaryData.saveSalaryData(this.currentCompanyId, this.currentUserId, {
      ...this.monthPayroll
    });

    await this.salaryData.updateMonthAvg(this.currentCompanyId, this.currentUserId, this.userData.monthAvg);

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

  calculatePaymentBaseDays(): number{
    const targetYear = parseInt(this.inputPayMonth.substring(0,4));
    const targetMonth = parseInt(this.inputPayMonth.substring(4,6));

    if(this.userData.employmentType === '正社員'){
      const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
      return daysInMonth - this.inputAbsentDays!;
    }

    else if(this.userData.employmentType === 'パート・アルバイト'){
      return this.inputWorkDays! + this.inputPaidLeaveDays!
    }

    else if(this.userData.employmentType === '役員'){
      return  new Date(targetYear, targetMonth, 0).getDate();
    }

    return 0;

  }

  calculateTotalWages(): number {
    const totalFixed = this.monthPayroll.fixedWages.reduce((sum, item)=> sum + item.amount, 0);
    const totalValiable = this.monthPayroll.variableWages.reduce((sum, item)=> sum + item.amount, 0);
    const transport = this.monthPayroll.transportationFee || 0;

    return totalFixed + totalValiable + transport;
  }




}
