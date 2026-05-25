import { Injectable, inject } from '@angular/core';
import { Firestore, doc, collection, setDoc, addDoc, query, where, getDocs} from '@angular/fire/firestore';

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
}
