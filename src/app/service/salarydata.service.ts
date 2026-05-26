import { Injectable, inject } from '@angular/core';
import { Firestore, doc, collection, updateDoc, addDoc, query, where, getDocs} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SalarydataService {

  private firestore = inject(Firestore);

  async saveSalaryData(companyId: string, userId: string, salaryData: any ){
    const employeeCollection = collection(this.firestore, 'company', companyId, 'employees');
    const q = query(employeeCollection, where('employeeId', '==', userId));
    const querySnapshot = await getDocs(q);

    const employeeId = querySnapshot.docs[0].id;

    const salaryCollection = collection(this.firestore, 'company', companyId, 'employees', employeeId, 'salary');

    addDoc(salaryCollection,{
      ...salaryData,
      createdAt: new Date()
    })

    localStorage.removeItem('current_user_data');

  }

  async calculateMonthAvg(companyId: string, userId: string){

    const employeeCollection = collection(this.firestore, 'company', companyId, 'employees');
    const q = query(
      employeeCollection,
      where('employeeId','==',userId)
    );

    const userSnap = await getDocs(q);

    if(!userSnap.empty){
      const docRef = userSnap.docs[0].ref;

      const salaryCollection = collection(this.firestore, 'company', companyId, 'employees', docRef.id, 'salaly');

      const salarySnap = await getDocs(salaryCollection);

      salaryData: [] = [];



    }

  }

  async updateMonthAvg(companyId: string, userId: string, monthAvg: number){
    const userDocRef = collection(this.firestore, 'company', companyId,'employees');
    const q = query(
      userDocRef,
      where('employeeId', '==', userId)
    );
    const userSnap = await getDocs(q);
    if(!userSnap.empty){
      const docRef = userSnap.docs[0].ref;

      const employeeDoc = doc(this.firestore, 'company', companyId, 'employees', docRef.id);
      await updateDoc(employeeDoc,{
        monthAvg: monthAvg
      });
    }
  }

   



  
}
