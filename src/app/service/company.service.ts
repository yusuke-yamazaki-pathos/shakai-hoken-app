import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private firestore : Firestore = inject(Firestore);
  companyId = localStorage.getItem('current_company_id');


  async saveCompany(companyData: any): Promise<any>{
    const CompanyCollection = collection(this.firestore, 'company');

    if(companyData.helthInsurance === '協会けんぽ'){
      delete companyData.comRate;
      delete companyData.isfamilyDiscount;
      delete companyData.isSpecialRetirement; 
      delete companyData.continueMaxMonthAvg;
      delete companyData.specialRetirementMax;
      delete companyData.maxInsuranceClass;
      delete companyData.dependentMonthlyFee;
    }
    
    const docRef = await addDoc(CompanyCollection,{
      ...companyData,
      createdAt: new Date()
    });

    return docRef;
  }

  async saveEmployees(companyId: any, employeeData: any): Promise<any>{

    if(employeeData.dependentCount && employeeData.dependentCount === 0){
      delete employeeData.dependents;
    }

    const employeesCollection = collection(this.firestore, `company`, companyId, `employees`);
    const docRef = await addDoc(employeesCollection,{
      ...employeeData,
      createdAt: new Date()
    });
  }

  async serchCompany(id: string): Promise<any>{

    const docRef = doc(this.firestore,`company`, id);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const companyData = {
        ...docSnap.data()
      };
      return companyData;
    }
  }
}
