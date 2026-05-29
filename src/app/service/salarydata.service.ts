import { Injectable, inject } from '@angular/core';
import { Firestore, doc, collection, updateDoc, setDoc, query, where, getDocs} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SalarydataService {

  private firestore = inject(Firestore);

  async saveSalaryData(companyId: string, userId: string, targetMonth: string, salaryData: any ){
    
    const salaryDocRef = doc(this.firestore, 'company', companyId, 'employees', userId, 'salary',targetMonth);

    await setDoc(salaryDocRef,{
      ...salaryData,
      createdAt: new Date()
    })
  }


  async updateHealthMonthAvg(companyId: string, userId: string, monthAvg: number){
    const userDocRef = doc(this.firestore, 'company', companyId,'employees', userId);
   
    await updateDoc(userDocRef,{
      healthMonthAvg: monthAvg
    });
  }

  async updatePensionMonthAvg(companyId: string, userId: string, monthAvg: number){

    const employeeDoc = doc(this.firestore, 'company', companyId, 'employees', userId);
    await updateDoc(employeeDoc,{
      pensionMonthAvg: monthAvg
    });
    
  }

   



  
}
