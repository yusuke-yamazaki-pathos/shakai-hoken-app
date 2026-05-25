import { Component, inject  } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink, Router} from '@angular/router';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-generate-company',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './generate-company.component.html',
  styleUrl: './generate-company.component.scss'
})
export class GenerateCompanyComponent {

  private firestore : Firestore = inject(Firestore); 
  private companyService = inject(CompanyService);
  private router = inject(Router);

  inputComName : string = "";
  inputComAdd: string = "";
  inputComPass: string = "";
  inputComHelthInsurance: string = "";
  inputComRate: number | null = null;
  selectSarary: string = "";
  selectCollect: string = "";
  inputAdminCode: string = "";
  orgInsuranceMax: number | null = null;
  isSpecifiedCompany : boolean = false;
  isSpecialRetirement: boolean = false;
  continueMaxMonthAvg: number | null = null;
  specialRetirementMax: number | null = null;
  maxInsuranceClass: number | null = null;
  minInsuranceClass: number | null = null;
  isfamilyDiscount: boolean = false;
  dependentMonthlyFee: number | null = null;
  inputAdminPass: string = "";
  inputAdminId: string = "admin";



  


  async comSave(){

    if(!this.inputComName){
      alert('会社名を入力してください');
      return;
    }

    const randomPass = Math.random().toString(36).substring(2, 10);
    this.inputComPass = randomPass;

    const randomAdminPass = Math.random().toString(36).substring(2, 10);
    this.inputAdminPass = randomAdminPass;

    try{
      const docRef = await this.companyService.saveCompany({

        name: this.inputComName,
        addres: this.inputComAdd,
        pass: this.inputComPass,
        helthInsurance: this.inputComHelthInsurance,
        comRate: this.inputComRate,
        sarary: this.selectSarary,
        collect: this.selectCollect,
        adminCode: this.inputAdminCode,
        isSpecifiedCompany: this.isSpecifiedCompany,
        isSpecialRetirement: this.isSpecialRetirement,
        comrate: this.inputComRate,
        continueMaxMonthAvg: this.continueMaxMonthAvg,
        specialRetirementMax: this.specialRetirementMax,
        maxInsuranceClass: this.maxInsuranceClass,
        isfamilyDiscount: this.isfamilyDiscount,
        dependentMonthlyFee: this.dependentMonthlyFee,
    
      })

      const employeeRef = await this.companyService.saveEmployees(docRef.id,{
        employeeId:this.inputAdminId,
        pass: this.inputAdminPass,
        name: '管理者'

      })



      const copyText = `【組織コード】：${docRef.id}\n【組織パスワード】：${this.inputComPass}\n【管理者用ID】：${this.inputAdminId}\n【管理者用パスワード】：${this.inputAdminPass}\n`;
      await navigator.clipboard.writeText(copyText);

      alert(
        `組織登録が完了いたしました。\n\n`+
        `------------------------------------\n`+
        `【組織コード】：${docRef.id}\n`+
        `【組織パスワード】：${this.inputComPass}\n`+
        `【管理者用ID】：${this.inputAdminId}\n`+
        `【管理者用パスワード】：${this.inputAdminPass}\n`+
        `------------------------------------\n\n`+
        `上記の情報が自動的にコピーされました！\n`+
        `メモやチャットにそのまま貼り付け(ctr + V)して保管してください。\n`+
        `※管理者としてログインする際は管理者用IDとパスワードを使用してください`

      );

      localStorage.setItem('contract_verified','true');
      const existingData = localStorage.getItem('saved_company_ids');
      let companyIds: string[] = existingData? JSON.parse(existingData):[];

      if(!companyIds.includes(docRef.id)){
        companyIds.push(docRef.id);
      }

      localStorage.setItem('saved_company_ids', JSON.stringify(companyIds));

      this.inputComName = "";
      this.inputComAdd = "";
      this.inputComPass = "";
      this.selectSarary = "";
      this.selectCollect = "";
      this.inputAdminCode = "";
      this.isSpecifiedCompany = false;
      this.isSpecialRetirement = false;
      this.inputComRate = null;
      this.specialRetirementMax = null;
      this.maxInsuranceClass = null;
      this.minInsuranceClass = null;
      this.isfamilyDiscount = false;
      this.inputComHelthInsurance = "";
      this.inputAdminId = "";
      this.inputAdminPass = "";
      this.router.navigate(['/user-login'])
    
    } catch (error: any){
      console.error('保存エラー:',error);
    
      alert('保存に失敗しました');
    }
  }
}