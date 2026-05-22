import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private firestore : Firestore = inject(Firestore);
 


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

  async updateUserData(companyId: string, userId: string, updatedUserData: any){

   const employeeCollection = collection(this.firestore, `company`, companyId, `employees`);

   const q = query(
    employeeCollection,
    where('id', '==', userId)
   );

   const userSnap = await getDocs(q);

   if(!userSnap.empty){

    const docRef = userSnap.docs[0].ref;

    await updateDoc(docRef,updatedUserData );
    
   }

  }
}
