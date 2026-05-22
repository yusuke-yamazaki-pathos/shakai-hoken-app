import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../service/company.service'; // 💡 既存のCompanyServiceをインポート

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent {
  private dialogRef = inject(MatDialogRef<EmployeeEditComponent>);
  private companyService = inject(CompanyService); // 💡 CompanyServiceをインジェクション

  // HTMLの入力欄（[(ngModel)]）と連動させるための変数
  editUser: any = {};

  // 元の画面から「会社ID（companyId）」と「従業員データ（userData）」をセットで受け取る
  constructor(@Inject(MAT_DIALOG_DATA) public data: { companyId: string, userData: any }) {
    // 元のプロフィール画面のデータを直接汚さないよう、コピー（シャローコピー）を作って編集用データにします
    this.editUser = { ...this.data.userData };
  }

  // キャンセルボタンを押したとき
  onCancel(): void {
    this.dialogRef.close(); // 何もデータを返さずにポップアップを閉じる
  }

  // 🔥 変更を保存ボタンを押したとき
  async onSave() {
    try {
      const companyId = this.data.companyId;
      const userId = this.editUser.id; // フィールドの「id」

      // 1. 既存の CompanyService を使ってFirestore上のデータを上書き更新！
      await this.companyService.updateUserData(companyId, userId, this.editUser);
      console.log('Firestoreへの上書き保存が成功しました！');

      // 2. ブラウザにキャッシュしているlocalStorageのデータも最新状態に書き換える
      localStorage.setItem('user_data', JSON.stringify(this.editUser));
      console.log('localStorageの更新が成功しました！');

      // 3. すべての処理が大成功したら、ポップアップを閉じる
      this.dialogRef.close();

    } catch (error) {
      console.error('保存処理中にエラーが発生しました:', error);
      alert('データの保存に失敗しました。お手数ですがもう一度お試しください。');
    }
  }
}
