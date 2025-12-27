import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccountDetailsComponent } from './account-details/account-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthenticationGuard] },
  { path: 'new-customer', component: NewCustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'customer-accounts/:id', component: CustomerAccountsComponent, canActivate: [AuthenticationGuard] },
  { path: 'account-details/:id', component: AccountDetailsComponent, canActivate: [AuthenticationGuard] }
];
