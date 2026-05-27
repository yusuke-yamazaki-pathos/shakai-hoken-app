import { Injectable,inject } from '@angular/core';
import { Firestore, doc, getDocs, collection, getDoc, query, where, setDoc } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class CalculateShakaihokenService {

  private readonly gradeTable = [
    { max: 63000, wage: 58000 },    // 健保1級
    { max: 73000, wage: 68000 },    
    { max: 84000, wage: 78000 },    
    { max: 94000, wage: 88000 },    
    { max: 101000, wage: 98000 },   
    { max: 107000, wage: 104000 },  
    { max: 114000, wage: 110000 },  
    { max: 122000, wage: 118000 },  
    { max: 130000, wage: 126000 },  // 厚生年金1級
    { max: 138000, wage: 134000 },  
    { max: 146000, wage: 142000 },  
    { max: 155000, wage: 150000 },  
    { max: 165000, wage: 160000 },  
    { max: 175000, wage: 170000 },  
    { max: 185000, wage: 180000 },  
    { max: 195000, wage: 190000 },  
    { max: 210000, wage: 200000 },  
    { max: 230000, wage: 220000 },  
    { max: 250000, wage: 240000 },  
    { max: 270000, wage: 260000 },  
    { max: 290000, wage: 280000 },  
    { max: 310000, wage: 300000 },  
    { max: 335000, wage: 320000 },  
    { max: 355000, wage: 340000 },  
    { max: 375000, wage: 360000 }, 
    { max: 375000, wage: 360000 },  
    { max: 395000, wage: 380000 },  
    { max: 425000, wage: 410000 },  
    { max: 455000, wage: 440000 },  
    { max: 485000, wage: 470000 },  
    { max: 515000, wage: 500000 },  
    { max: 545000, wage: 530000 },  
    { max: 575000, wage: 560000 },  
    { max: 605000, wage: 590000 },  
    { max: 635000, wage: 620000 },  // 厚生年金31級
    { max: 665000, wage: 650000 },  // 厚生年金32級（上限）
    { max: 695000, wage: 680000 },  
    { max: 730000, wage: 710000 },  
    { max: 770000, wage: 750000 }, 
    { max: 810000, wage: 790000 },  
    { max: 850000, wage: 830000 },  
    { max: 890000, wage: 870000 },  
    { max: 930000, wage: 910000 },  
    { max: 980000, wage: 950000 },  
    { max: 1030000, wage: 1010000 },
    { max: 1090000, wage: 1060000 },
    { max: 1150000, wage: 1120000 },
    { max: 1210000, wage: 1180000 },
    { max: 1270000, wage: 1240000 },
    { max: 1330000, wage: 1300000 },
    { max: Infinity, wage: 1390000 } // 健保50級（上限）
  ];

  private firestore = inject(Firestore);



  getMonthAvg(monthAvg: number): number{
    const math = this.gradeTable.find(item => monthAvg < item.max);
    return math ? math.wage : 1390000;

  }

  getPensionMonthAvg(monthAvg: number): number{
    if(monthAvg < 122000) return 126000;
    if(monthAvg >= 635000) return 650000;

    return this.getMonthAvg(monthAvg);
  }

  async calInsurance(companyId: string, userId: string){
    //ここで会社の料率と従業員の報酬月額する
  }

 async getHealthRate(companyId: string){
    const companyDoc = doc(this.firestore, 'company', companyId);
    const companySnap =  await getDoc(companyDoc);
    if(companySnap.exists()){
      const companyData = companySnap.data();
      return companyData['healthInsuranceRate'];
    }
  }

  async getPensionRate(companyId: string){
    const companyDoc = doc(this.firestore, 'company', companyId);
    const companySnap =  await getDoc(companyDoc);
    if(companySnap.exists()){
      const companyData = companySnap.data();
      return companyData['welfarePensionRate'];
    }
  }

  async getCareRate(companyId: string){
    const companyDoc = doc(this.firestore, 'company', companyId);
    const companySnap =  await getDoc(companyDoc);
    if(companySnap.exists()){
      const companyData = companySnap.data();
      return companyData['longermCareRate'];
    }
  }

  async getHealthComRate(companyId: string){
    const companyDoc = doc(this.firestore, 'company', companyId);
    const companySnap =  await getDoc(companyDoc);
    if(companySnap.exists()){
      const companyData = companySnap.data();
      return companyData['healthcomRate'];
    }
  }

  async getCareComRate(companyId: string){
    const companyDoc = doc(this.firestore, 'company', companyId);
    const companySnap =  await getDoc(companyDoc);
    if(companySnap.exists()){
      const companyData = companySnap.data();
      return companyData['careComRate'];
    }
  }

  async saveHealthInsurance(companyId: string, userId: string, targetMonth: string, companyHealthInsurance: number, userhealthInsurance: number, totalHealthInsurance: number ){
    const employeeRef = collection(this.firestore, 'company', companyId, 'employees');
    const q = query(
      employeeRef,
      where('employeeId', '==', userId)
    );
    const userSnap = await getDocs(q);
    const employeesId =userSnap.docs[0].id;

    const salaryCollection = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary');
    const salaryq = query(
      salaryCollection,
      where('targetMonth', '==', targetMonth)
    );
    const salarySnap = await getDocs(salaryq);
    const salaryId = salarySnap.docs[0].id;

    const shakaihokenCollectionRef = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary', salaryId, 'shakaihoken');
    const healthDoc = doc(shakaihokenCollectionRef, 'health');
    await setDoc(healthDoc,{
      companyCost: companyHealthInsurance,
      userCost: userhealthInsurance,
      totalCost: totalHealthInsurance,
      createdAt: new Date()
    })

  }

  async savePensionWage(companyId: string, userId: string, targetMonth: string, companyPensionWage: number, userPensionWage: number, totalPensionWage: number ){
    const employeeRef = collection(this.firestore, 'company', companyId, 'employees');
    const q = query(
      employeeRef,
      where('employeeId', '==', userId)
    );
    const userSnap = await getDocs(q);
    const employeesId =userSnap.docs[0].id;

    const salaryCollection = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary');
    const salaryq = query(
      salaryCollection,
      where('targetMonth', '==', targetMonth)
    );
    const salarySnap = await getDocs(salaryq);
    const salaryId = salarySnap.docs[0].id;

    const shakaihokenCollectionRef = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary', salaryId, 'shakaihoken');
    const pensionDoc = doc(shakaihokenCollectionRef, 'pension');
    await setDoc(pensionDoc,{
      companyCost: companyPensionWage,
      userCost: userPensionWage,
      totalCost: totalPensionWage,
      createdAt: new Date()
    })

  }

  async saveCareInsurance(companyId: string, userId: string, targetMonth: string, companyCare: number, userCare: number, totalCare: number ){
    const employeeRef = collection(this.firestore, 'company', companyId, 'employees');
    const q = query(
      employeeRef,
      where('employeeId', '==', userId)
    );
    const userSnap = await getDocs(q);
    const employeesId =userSnap.docs[0].id;

    const salaryCollection = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary');
    const salaryq = query(
      salaryCollection,
      where('targetMonth', '==', targetMonth)
    );
    const salarySnap = await getDocs(salaryq);
    const salaryId = salarySnap.docs[0].id;

    const shakaihokenCollectionRef = collection(this.firestore, 'company', companyId, 'employees', employeesId, 'salary', salaryId, 'shakaihoken');
    const pensionDoc = doc(shakaihokenCollectionRef, 'care');
    await setDoc(pensionDoc,{
      companyCost: companyCare,
      userCost: userCare,
      totalCost: totalCare,
      createdAt: new Date()
    })

  }

  isKaigohoken(birthDate: string): boolean{
    if(!birthDate) return false;

    const birthDay = new Date(birthDate);
    const today = new Date();

    const currentYearBirthdayMinus1 = new Date(today.getFullYear(), birthDay.getMonth(),birthDay.getDate() -1);
    let age = today.getFullYear() - birthDay.getFullYear();
    if(today < currentYearBirthdayMinus1){
      age--;
    }

    return age >= 40 && age < 65;

  }
}
