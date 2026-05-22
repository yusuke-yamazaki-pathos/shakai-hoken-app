import { Injectable,inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDialogService {
  private dialog = inject(MatDialog);

  async openEdit(companyId: string, userData: any): Promise<any | null>{
    const dialogRef = this.dialog.open(EmployeeEditComponent,{
      width: '500px',
      data: {companyId,userData }
    });

    return await firstValueFrom(dialogRef.afterClosed());
 
  }
}
