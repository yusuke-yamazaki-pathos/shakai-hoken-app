import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, doc, getDoc } from '@angular/fire/firestore'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private firestore = inject(Firestore);

  current_company_id : string = "";
  current_user_id: string = "";

  async checkComId(inputId: string, inputPass: string): Promise <boolean> {
    try{
      const docRef = doc(this.firestore, 'company', inputId);

      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        const companyData = docSnap.data();

        if(companyData['pass'] === inputPass){

          this.current_company_id = inputId;
          localStorage.setItem('current_company_id',inputId);
          console.log('組織ログイン成功',inputId);

          return true;

        }
      }

      console.warn('会社IDが存在しないか、パスワードが違います');
      return false;

    } catch(error){
      console.error('通信エラー:',error);
      return false;
    }
  }

  async userLogin (inputCompanyId: string, inputEmployeeId: string, inputEmployeePass: string ): Promise<boolean>{

    try{
      const employeeRef = collection(this.firestore, `company`, inputCompanyId, `employees`);

      const q = query(
        employeeRef,
        where('id','==',inputEmployeeId),
      );

      const querySnapshot = await getDocs(q);

      if(querySnapshot.empty){
        console.warn('ユーザーが存在しません');
        return false;
      }

      let isSuccess = false;

      querySnapshot.forEach((doc)=>{
        const employeeData = doc.data();
        console.log('見つかったデータ',employeeData);
        console.log(`入力PASS[${inputEmployeePass}],DBのPASS「${employeeData['pass']}`);

        if(employeeData['pass'] === inputEmployeePass){
          isSuccess = true;
          this.current_user_id = inputEmployeeId;
          this.current_company_id = inputCompanyId;
          localStorage.setItem('current_company_id',inputCompanyId);
          localStorage.setItem('current_user_id',inputEmployeeId);
        }
      })

      return isSuccess;
    }
    catch (error){
      console.error('通信エラー',error);
      return false;
    }
  }

  async getUserData(companyId: string, userId: string): Promise<any>{

    const userRef = collection(this.firestore, `company`, companyId, `employees`);

    const q = query(
      userRef,
      where('id', '==', userId),
    );

    const userSnap = await getDocs(q);

    if(!userSnap.empty){
      return userSnap.docs[0].data();
    }
    else{
      console.log('ユーザーが見つかりません')
      return null;
    }

  }
}
