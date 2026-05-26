import { Component, inject } from '@angular/core';
import { CalculateShakaihokenService } from '../service/calculate-shakaihoken.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-calculate-shakaihoken',
  standalone: true,
  imports: [],
  templateUrl: './calculate-shakaihoken.component.html',
  styleUrl: './calculate-shakaihoken.component.scss'
})
export class CalculateShakaihokenComponent {

  private calculateShaikaihoken = inject(CalculateShakaihokenService)

  currentCompanyId: string = "";
  currentUserId: string = "";
  userData: any = null;
  isHealthInsurance: boolean = false;

  ngOnInit(){
    this.currentCompanyId = localStorage.getItem('current_company_id') || "";
    this.currentUserId = localStorage.getItem('current_user_id') || "";
    if(this.currentUserId === "admin"){
      const userDataString = localStorage.getItem('current_user_data');
      if(userDataString){
        this.userData = JSON.parse(userDataString);
        this.currentUserId = this.userData.employeeId;
      };
    }
    this.checkCompanyInsurance();
  }

  async checkCompanyInsurance() : Promise<boolean>{

    this.isHealthInsurance =  await this.calculateShaikaihoken.judghCompnyInsurance(this.currentCompanyId);

  }

    








  }



}
