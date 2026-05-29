import { Injectable,inject } from '@angular/core';
import { Firestore, doc, getDocs, collection, getDoc, query, where, setDoc, addDoc } from '@angular/fire/firestore';

interface Insurance{
  totalAmount: number;
  comAmount: number;
  userAmount: number;
}

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
      return companyData['healthComRate'];
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
    
    const healthDocRef = doc(this.firestore, 'company', companyId, 'employees', userId, 'salary',targetMonth,'shakaihoken', 'health');
    await setDoc(healthDocRef,{
      companyCost: companyHealthInsurance,
      userCost: userhealthInsurance,
      totalCost: totalHealthInsurance,
      createdAt: new Date()
    })

  }

  async savePensionWage(companyId: string, userId: string, targetMonth: string, companyPensionWage: number, userPensionWage: number, totalPensionWage: number ){
    
    const pensionDocRef = doc(this.firestore, 'company', companyId, 'employees', userId, 'salary', targetMonth, 'shakaihoken','pension');
    await setDoc(pensionDocRef,{
      companyCost: companyPensionWage,
      userCost: userPensionWage,
      totalCost: totalPensionWage,
      createdAt: new Date()
    })

  }

  async saveCareInsurance(companyId: string, userId: string, targetMonth: string, companyCare: number, userCare: number, totalCare: number ){
    
    const pensionDocRef = doc(this.firestore, 'company', companyId, 'employees', userId, 'salary', targetMonth, 'shakaihoken', 'care');
    await setDoc(pensionDocRef,{
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

  async saveBonus(companyId: string, userId: string, date: string, bonusData: any){

    let standardBonusAmount = bonusData.standardBonus;

    const employeeDocRef = doc(this.firestore, 'company', companyId, 'employees',userId);
    const employeeSnap = await getDoc(employeeDocRef);
    const employeeData = employeeSnap.data();
    const birthDate = employeeData?.['birthDay'];
    const employeeId = userId;

    await this.createBonusCollection(companyId, employeeId);
    const bonusSummaryData = await this.getBonusCount(companyId, employeeId);
    let bonusCount = bonusSummaryData?.['bonusCount']  || 0;
    let bonusTotalAmount = bonusSummaryData?.['bonusTotalAmount'] || 0;

    const employeeBonusDocRef = doc(this.firestore, 'company', companyId, 'employees',employeeId,'bonus',date);
    const bonusRef = await setDoc(employeeBonusDocRef,{
      ...bonusData,
      createdAt: new Date()
    });

    bonusCount += 1;
    bonusTotalAmount += bonusData?.['amount'];
    if(bonusTotalAmount > 5730000){
      standardBonusAmount = 5730000-(bonusTotalAmount - bonusData.amount);

      if(standardBonusAmount < 0)standardBonusAmount = 0;
    }


    await this.updateSummary(companyId, employeeId, bonusCount, bonusTotalAmount);





    const bonusId = date;



    let isTarget: boolean = false;

    if(bonusCount < 4 && standardBonusAmount !== 0){

      
      const healthRate = await this.getHealthRate(companyId); // 料率
      const pensionRate = await this.getPensionRate(companyId);
    
      const healthComRate = await this.getHealthComRate(companyId); //会社負担割合
      const pensionComRate = 0.5;

      const standardPensionAmount = Math.min(standardBonusAmount, 1500000);
    

      const [ totalHealthInsurance, healthComInsurance, healthUserInsurance ] = await this.calInsurance( standardBonusAmount, healthRate, healthComRate );
      const  [ totalPensionWage, pensionComWage, pensionUserWage ] = await this.calInsurance(standardPensionAmount, pensionRate, pensionComRate);


      await this.saveInsuranceBonus(companyId, employeeId, bonusId, totalHealthInsurance, healthComInsurance, healthUserInsurance, 'health');
      await this.saveInsuranceBonus(companyId, employeeId, bonusId, totalPensionWage, pensionComWage, pensionUserWage, 'pension');
    
   
    
      isTarget = await this.isKaigohoken(birthDate);
      if(isTarget){
        const careRate = await this.getCareRate(companyId);
        const careComRate = await this.getCareComRate(companyId);

        const [ totalCareAmount, careComAmount, careUserAmount ] = await this.calInsurance(standardBonusAmount, careRate, careComRate);
        await this.saveInsuranceBonus(companyId, employeeId, bonusId,totalCareAmount, careComAmount, careUserAmount,'care');

      }
    }

    else {
      await this.saveInsuranceBonus(companyId, employeeId, bonusId, 0, 0, 0, 'health');
      await this.saveInsuranceBonus(companyId, employeeId, bonusId, 0, 0, 0,'pension');
      if(isTarget){
        await this.saveInsuranceBonus(companyId, employeeId, bonusId, 0, 0, 0,'care');
      }

      if(bonusCount >= 4){

        await this.saveNewMonthAvg(companyId,employeeId,bonusTotalAmount,date);

      }

    }
  }

  async calInsurance(standardAmount: number, rate: number, ratio: number){

    const calTotalAmount = standardAmount * rate;
    const calComAmount = calTotalAmount * ratio;
    const calUserAmount = calTotalAmount - calComAmount;

    return [
      Math.floor(calTotalAmount),
      Math.floor(calComAmount),
      Math.floor(calUserAmount)
    ];

  }

  async saveInsuranceBonus(companyId: string, employeeId: string, bonusId: string, totalAmount: number, comAmount: number, userAmount: number, targetName: string){

    const shakaihokenCollectionRef = collection(this.firestore, 'company', companyId, 'employees', employeeId, 'bonus', bonusId, 'shakaihoken');
    const shakaihokenDoc = doc(shakaihokenCollectionRef, targetName);
    await setDoc(shakaihokenDoc,{
      totalAmount: totalAmount,
      comAmount: comAmount,
      userAmount: userAmount,
      createdAt: new Date()
    });


  }

  async createBonusCollection(companyId: string, employeeId: string){
    const bonusCollectionRef = collection(this.firestore, 'company', companyId, 'employees', employeeId, 'bonus');
    const bonusSnap = await getDocs(bonusCollectionRef);
    if(bonusSnap.empty){
      const summaryDocRef = doc(bonusCollectionRef, 'summary');
      await setDoc(summaryDocRef,{
        bonusCount: 0,
        bonusTotalAmount:0,
        updatedAt: new Date()
      });
    }
  }

  async getBonusCount(companyId: string, employeeId: string){
    const summaryDocRef = doc(this.firestore, 'company', companyId, 'employees', employeeId, 'bonus', 'summary');
    const summarySnap = await getDoc(summaryDocRef);
    return summarySnap.data();
  }

  async updateSummary(companyId: string, employeeId: string, bonusCount: number, bonusTotal: number){
    const summaryDocRef = doc(this.firestore, 'company',companyId, 'employees', employeeId, 'bonus','summary');
    await setDoc(summaryDocRef,{
      bonusCount: bonusCount,
      bonusTotalAmount: bonusTotal,
      createdAt: new Date()
    }),{merge: true};
  }

  async saveNewMonthAvg(companyId: string, employeeId: string, bonusTotalAmount: number, date: string){
    const employeeDocRef = doc(this.firestore, 'company', companyId, 'employees', employeeId);
    const employeeSnap = await getDoc(employeeDocRef);
    if(employeeSnap.exists()){
      const employeeData =employeeSnap.data();
      const healthMonthAvg = employeeData?.['healthMonthAvg'];
      const pensionMonthAvg = employeeData?.['pensionMonthAvg'];

      const addMonthAvg = Math.floor(bonusTotalAmount / 12);
      const gethealthMonthAvg = healthMonthAvg + addMonthAvg;
      const newHealthMonthAvg = await this.getMonthAvg(gethealthMonthAvg);
      const getPensionAvg = pensionMonthAvg + addMonthAvg;
      const newPensionMonthAvg = await this.getPensionMonthAvg(getPensionAvg);
      const changeYearMonth = await this.calculateYearMonth(date)


      const companyCollectionRef = collection(this.firestore, 'company', companyId, 'changeReservation');
      await addDoc(companyCollectionRef,{
        employeeId: employeeId,
        changeYearMonth: changeYearMonth,
        newHealthMonthAvg: newHealthMonthAvg,
        newPensionMonthAvg: newPensionMonthAvg,
        isActive: true,
        type: "monthAvg-change",
        createdAt: new Date()
      });
    }
  }

  async calculateYearMonth(date: string){
    const year = parseInt(date.substring(0,4),10);
    const month = parseInt(date.substring(4,6),10);

    const targetDate = new Date(year,month - 1,1);
    targetDate.setMonth(targetDate.getMonth() + 4);

    const nextYear = targetDate.getFullYear();
    const nextMonth = String(targetDate.getMonth() + 1).padStart(2,'0');

    return `${nextYear}${nextMonth}`;
  }
}
