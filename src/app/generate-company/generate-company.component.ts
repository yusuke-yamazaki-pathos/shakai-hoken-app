import { Component, inject  } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink, Router} from '@angular/router';
import { CompanyService } from '../service/company.service';

export interface InsuranceRate{
  healthRate: number;
}

export const KYOUKAI_KENPO_RATES: { [key: string]: InsuranceRate } = {
  '北海道': { healthRate: 0.1005 },
  '青森県': { healthRate: 0.0984 },
  '岩手県': { healthRate: 0.0967 },
  '宮城県': { healthRate: 0.0978 },
  '秋田県': { healthRate: 0.0991 },
  '山形県': { healthRate: 0.0967 },
  '福島県': { healthRate: 0.0969 },
  '茨城県': { healthRate: 0.0949 },
  '栃木県': { healthRate: 0.0954 },
  '群馬県': { healthRate: 0.0959 },
  '埼玉県': { healthRate: 0.0967 }, // 令和8年度改定値
  '千葉県': { healthRate: 0.0973 }, // 令和8年度改定値
  '東京都': { healthRate: 0.0985 }, // 令和8年度改定値
  '神奈川県': { healthRate: 0.0992 },// 令和8年度改定値
  '新潟県': { healthRate: 0.0921 }, // 最低料率
  '富山県': { healthRate: 0.0959 },
  '石川県': { healthRate: 0.0970 },
  '福井県': { healthRate: 0.0964 },
  '山梨県': { healthRate: 0.0963 },
  '長野県': { healthRate: 0.0945 },
  '岐阜県': { healthRate: 0.0972 },
  '静岡県': { healthRate: 0.0966 },
  '愛知県': { healthRate: 0.0975 },
  '三重県': { healthRate: 0.0980 },
  '滋賀県': { healthRate: 0.0970 },
  '京都府': { healthRate: 0.1001 },
  '大阪府': { healthRate: 0.1013 }, // 令和8年度改定値
  '兵庫県': { healthRate: 0.1001 },
  '奈良県': { healthRate: 0.1008 },
  '和歌山県': { healthRate: 0.1005 },
  '鳥取県': { healthRate: 0.0981 },
  '島根県': { healthRate: 0.0993 },
  '岡山県': { healthRate: 0.1003 },
  '広島県': { healthRate: 0.0988 },
  '山口県': { healthRate: 0.1007 },
  '徳島県': { healthRate: 0.1012 },
  '香川県': { healthRate: 0.1011 },
  '愛媛県': { healthRate: 0.1002 },
  '高知県': { healthRate: 0.1019 },
  '福岡県': { healthRate: 0.1014 },
  '佐賀県': { healthRate: 0.1055 }, // 最高料率
  '長崎県': { healthRate: 0.1010 },
  '熊本県': { healthRate: 0.1010 },
  '大分県': { healthRate: 0.1011 },
  '宮崎県': { healthRate: 0.0987 },
  '鹿児島県': { healthRate: 0.1016 },
  '沖縄県': { healthRate: 0.0966 }
};






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
  inputComHealthRate: number | null = null;
  inputComCareRate: number | null = null;
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
  welfarePensionRate: number= 0.183; //厚生年金料率
  longermCareRate: number = 0.0162;//介護保険料率
  healthInsuranceRate: number | null = null;




  


  async comSave(){

    if(!this.inputComName){
      alert('会社名を入力してください');
      return;
    }

    const randomPass = Math.random().toString(36).substring(2, 10);
    this.inputComPass = randomPass;

    const randomAdminPass = Math.random().toString(36).substring(2, 10);
    this.inputAdminPass = randomAdminPass;

    if(this.inputComHelthInsurance === '協会けんぽ'){
      this.inputComHealthRate = 0.5;
      this.inputComCareRate = 0.5;
      if(this.inputComAdd && KYOUKAI_KENPO_RATES[this.inputComAdd]){
        this.healthInsuranceRate = KYOUKAI_KENPO_RATES[this.inputComAdd].healthRate;
      }
    }

    try{
      const docRef = await this.companyService.saveCompany({

        name: this.inputComName,
        addres: this.inputComAdd,
        pass: this.inputComPass,
        helthInsurance: this.inputComHelthInsurance,
        healthComRate: this.inputComHealthRate,
        careComRate: this.inputComCareRate,
        sarary: this.selectSarary,
        collect: this.selectCollect,
        adminCode: this.inputAdminCode,
        isSpecifiedCompany: this.isSpecifiedCompany,
        isSpecialRetirement: this.isSpecialRetirement,
        continueMaxMonthAvg: this.continueMaxMonthAvg,
        specialRetirementMax: this.specialRetirementMax,
        maxInsuranceClass: this.maxInsuranceClass,
        isfamilyDiscount: this.isfamilyDiscount,
        dependentMonthlyFee: this.dependentMonthlyFee,
        welfarePensionRate: this.welfarePensionRate, //厚生年金料率
        longermCareRate: this.longermCareRate,
        healthInsuranceRate: this.healthInsuranceRate

    
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
      this.inputComHealthRate = null;
      this.inputComCareRate = null;
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