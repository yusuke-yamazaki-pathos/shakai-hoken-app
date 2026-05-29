import { Routes } from '@angular/router';
import { GenerateCompanyComponent } from './generate-company/generate-company.component';
import { AppComponent} from './app.component';
import { InputEmployeeComponent } from './input-employee/input-employee.component';
import { InitialLoginComponent } from './initial-login/initial-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { LoginCheckComponent } from './login-check/login-check.component';
import { OutputPageComponent } from './output-page/output-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { SalaryComponent } from './salary/salary.component';
import { CalculateShakaihokenComponent } from './calculate-shakaihoken/calculate-shakaihoken.component';
import { BonusComponent } from './bonus/bonus.component';


export const routes: Routes = [
    {
        path:'',
        component:LoginCheckComponent
    },

    {
        path: 'login-check',
        component: LoginCheckComponent
    },

    {
        path:'input-employee',
        component: InputEmployeeComponent
    },

    {
        path: 'generate-company',
        component: GenerateCompanyComponent
    },

    {
        path: 'initial-login',
        component: InitialLoginComponent
    },

    {
        path: 'user-login',
        component: UserLoginComponent
    },

    {
        path: 'output-page',
        component: OutputPageComponent
    },

    {
        path: 'admin-page',
        component: AdminPageComponent
    },

    {
        path: 'employee-page',
        component: EmployeePageComponent
    },

    {
        path: 'employee-edit/:id',
        component: EmployeeEditComponent
    },

    {
        path: 'employee-edit',
        component: EmployeeEditComponent

    },
    {
        path: 'salary',
        component: SalaryComponent
    },

    {
        path: 'cal-insurance',
        component: CalculateShakaihokenComponent
    },

    {
        path: 'bonus',
        component: BonusComponent
    },


];
