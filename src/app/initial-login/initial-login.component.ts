import { Component, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firestore, getDocs, collection, query, where } from '@angular/fire/firestore';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-initial-login',
  standalone: true,
  imports: [ FormsModule, RouterLink ],
  templateUrl: './initial-login.component.html',
  styleUrl: './initial-login.component.scss'
})
export class InitialLoginComponent {
  private router = inject(Router);
  private firestore = inject(Firestore);
  private loginService = inject(LoginService);

  inputId : string = "";
  inputPass : string = "";
  

  async checkforms(){

    if(!this.inputId || !this.inputPass){
      return;
    }

    try{
      const result: boolean = await this.loginService.checkComId(this.inputId, this.inputPass);

      if(result){

        localStorage.setItem('contract_verified', 'true');

        const existingData = localStorage.getItem('saved_company_ids');
        let companyIds: string[] = existingData? JSON.parse(existingData):[];

        if(!companyIds.includes(this.inputId)){
          companyIds.push(this.inputId);
        }

        localStorage.setItem('saved_company_ids', JSON.stringify(companyIds));

        this.router.navigate(['/user-login']);

      }

      else{
        alert('契約コードまたは契約パスワードが間違っています。');
      }

    } catch (error){
      console.error('エラー:',error);
      alert('通信エラー');
    }
  }
}
