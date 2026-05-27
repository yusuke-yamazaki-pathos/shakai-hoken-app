import { Component, inject, OnInit } from '@angular/core';
import { CalculateShakaihokenService } from '../service/calculate-shakaihoken.service';
import { combineLatest } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Router, RouterLink }from '@angular/router';

@Component({
  selector: 'app-calculate-shakaihoken',
  standalone: true,
  imports: [],
  templateUrl: './calculate-shakaihoken.component.html',
  styleUrl: './calculate-shakaihoken.component.scss'
})
export class CalculateShakaihokenComponent implements OnInit {

  private calculateShaikaihoken = inject(CalculateShakaihokenService);
  private router = inject(Router);

  currentCompanyId: string = "";
  currentUserId: string = "";
  userData: any = null;
  healthRate: number | null = null;
  pensionRate: number | null = null;
  healthMonthAvg: number | null = null;
  pensionMonthAvg: number | null = null;
  userhealthInsurance: number | null = null;
  userPensionWage: number | null = null;
  companyHealthInsurance: number | null = null;
  companyPensionWage: number | null = null;
  healthcomRate: number | null = null;
  careComRate: number | null = null;
  totalHealthInsurance: number | null= null;
  totalPensionWage: number | null = null;
  targetMonth: string = "";
  isTarget: boolean = false;
  careRate: number | null = null;
  totalCareInsurance: number | null = null;
  companyCareInsurance:number | null = null;
  userCareInsurance: number | null = null;





  async ngOnInit(){
    this.currentCompanyId = localStorage.getItem('current_company_id') || "";
    this.currentUserId = localStorage.getItem('current_user_id') || "";
    const userDataString = localStorage.getItem('current_user_data');
    if(userDataString){
      this.userData = JSON.parse(userDataString);
    }
    if(this.currentUserId === "admin"){
     this.currentUserId = this.userData.employeeId;
    }

    

    await this.calInsurance();

    this.router.navigate(['/admin-page']);

  }

  async calInsurance(){

    await Promise.all([
      this.getHealthRate(),
      this.getPensionRate(),
      this.getHealthComRate(),
      this.isKaigohokenTarget()
    ]);


    if(this.isTarget){
      await this.getCareRate()
      await this.getCareComRate()
    }




    this.healthMonthAvg = this.userData.healthMonthAvg;
    this.pensionMonthAvg = this.userData.pensionMonthAvg;
    this.targetMonth = localStorage.getItem('targetMonth') || "";

    this.totalHealthInsurance = this.healthMonthAvg! * this.healthRate!;
    this.companyHealthInsurance = this.totalHealthInsurance * this.healthcomRate!;
    this.userhealthInsurance = this.totalHealthInsurance - this.companyHealthInsurance;

    this.totalPensionWage = this.pensionMonthAvg! * this.pensionRate!;
    this.companyPensionWage = this.totalPensionWage / 2;
    this.userPensionWage = this.totalPensionWage / 2;

    if(this.isTarget){
      this.totalCareInsurance = this.healthMonthAvg! * this.careRate!;
      this.companyCareInsurance = this.totalCareInsurance * this.careComRate!;
      this.userCareInsurance = this.totalCareInsurance - this.companyCareInsurance;
    }

    console.log('健康保険料率:',this.healthRate);
    console.log('健康保険標準報酬月額:',this.healthMonthAvg);
    console.log('総健康保険料:',this.totalHealthInsurance);
    console.log('会社負担割合:',this.healthcomRate);
    console.log('会社負担けんぽ:',this.companyHealthInsurance);
    console.log('個人負担けんぽ:',this.userhealthInsurance);
    
    await this.calculateShaikaihoken.saveHealthInsurance(this.currentCompanyId, this.currentUserId,this.targetMonth,this.companyHealthInsurance, this.userhealthInsurance, this.totalHealthInsurance);
    await this.calculateShaikaihoken.savePensionWage(this.currentCompanyId, this.currentUserId, this.targetMonth, this.companyPensionWage, this.userPensionWage, this.totalPensionWage);
    if(this.isTarget){

      await this.calculateShaikaihoken.saveCareInsurance(this.currentCompanyId, this.currentUserId,this.targetMonth,this.companyCareInsurance!, this.userCareInsurance!, this.totalCareInsurance!);

    }

  }

  async getHealthRate(){

    this.healthRate = await this.calculateShaikaihoken.getHealthRate(this.currentCompanyId);

  }

  async getPensionRate(){

    this.pensionRate = await this.calculateShaikaihoken.getPensionRate(this.currentCompanyId);

  }

  async getHealthComRate(){
    this.healthcomRate = await this.calculateShaikaihoken.getHealthComRate(this.currentCompanyId);
  }

  async isKaigohokenTarget(){
    this.isTarget = await this.calculateShaikaihoken.isKaigohoken(this.userData.birthDay);
  }

  async getCareComRate(){
    this.careComRate = await this.calculateShaikaihoken.getCareComRate(this.currentCompanyId);
  }

  async getCareRate(){

    this.careRate = await this.calculateShaikaihoken.getCareRate(this.currentCompanyId);

  }
}

    
