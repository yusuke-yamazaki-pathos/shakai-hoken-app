import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router} from '@angular/router';
import { LoginService } from '../service/login.service';
import { Firestore , doc, collection, getDoc } from '@angular/fire/firestore';
import { CompanyService } from '../service/company.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent implements OnInit {

  private loginService = inject(LoginService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private companyService = inject(CompanyService);

  checkId : string[] = [];
  companyIds: string[] = [];
  companyNames: any[] = [];
  inputUserId: string = "";
  inputUserPass: string = "";
  selectCompany: string = "";

  ngOnInit(): void {

    const existingData = localStorage.getItem('saved_company_ids');
    this.companyIds = existingData? JSON.parse(existingData):[];
    this.serchCompanyData();
    
  }

  async serchCompanyData(): Promise<void>{
    for(const id of this.companyIds){

      try{
        
        const companyData = await this.companyService.serchCompany(id);
        if(companyData && !companyData.id){
          companyData.id = id;
        }
        this.companyNames.push(companyData);
        
      } 
      catch (error){
        console.error('データエラー',error);
      }
    }
  }



  async checkUser(){

    console.log('現在組織',this.loginService.current_company_id);
    console.log('組織',this.selectCompany);
    console.log('ID',this.inputUserId);
    console.log('Pass',this.inputUserPass);

    try{
      const result: boolean = await this.loginService.userLogin(this.selectCompany, this.inputUserId, this.inputUserPass);

      if(result){
        this.router.navigate(['/output-page']);
      }

      else{
        alert('IDまたはパスワードが間違っています。');
      }

    }
    catch (error) {
      console.error('通信エラー',error);
      alert('通信エラー');
    }
  }
}
