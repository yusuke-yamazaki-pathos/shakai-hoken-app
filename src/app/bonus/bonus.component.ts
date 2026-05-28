import { Component, OnInit, inject } from '@angular/core';
import { CalculateShakaihokenService } from '../service/calculate-shakaihoken.service';
import { Router } from '@angular/router';

interface bonus {
  date: string;
  amount: number;
  standardBonus: number;
}



@Component({
  selector: 'app-bonus',
  standalone: true,
  imports: [],
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.scss'
})
export class BonusComponent implements OnInit {

  private calShakaihoken = inject(CalculateShakaihokenService);


  currentUserId : string = "";
  currentCompanyId : string = "";
  userData: any = null;
  inputBonusAmount: number | null = null;
  inputDate: string = "";

  bonus: bonus = {
    date: "",
    amount: 0,
    standardBonus: 0
  }

  ngOnInit(): void {
    this.currentUserId  = localStorage.getItem('current_user_id') || "";
    const userDataString = localStorage.getItem('current_user_data');
    if(userDataString){
      this.userData = JSON.parse(userDataString);
      this.currentUserId = this.userData.employeeId;
    };
    if(this.currentUserId === 'admin'){
      this.currentUserId = this.userData.employeeId;
    }

    this.currentCompanyId = localStorage.getItem('current_company_id') || "";
    console.log('user',this.currentUserId);
    console.log('company', this.currentCompanyId);
  }
  


  async saveBonus(){

    const standardBonusAmount = Math.floor(this.inputBonusAmount! / 1000) * 1000;

    this.bonus.date = this.inputDate;
    this.bonus.amount = this.inputBonusAmount!;
    this.bonus.standardBonus = standardBonusAmount;

    this.calShakaihoken.saveBonus(this.currentCompanyId, this.currentUserId, this.bonus);
    
  }
  


}
