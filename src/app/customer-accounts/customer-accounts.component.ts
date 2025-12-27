import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Customer } from '../model/customer.model';
import { AccountsService } from '../services/accounts.service';
import { BankAccount } from '../model/account.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-accounts',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  accounts$!: Observable<Array<BankAccount>>;
  errorMessage!: string;
  newAccountFormGroup!: FormGroup;
  showCreateAccountForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountsService: AccountsService,
    private fb: FormBuilder
  ) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.loadCustomerAccounts();

    this.newAccountFormGroup = this.fb.group({
      accountType: ['CurrentAccount'],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      interestRate: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadCustomerAccounts() {
    this.accounts$ = this.accountsService.getAllAccounts().pipe(
      map(accounts => accounts.filter(acc => acc.customerDTO.id === +this.customerId)),
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  handleCreateAccount() {
    if (this.newAccountFormGroup.invalid) return;

    const formValue = this.newAccountFormGroup.value;
    const accountType = formValue.accountType === 'SavingAccount' ? 'SAVING' : 'CURRENT';

    const newAccount = {
      customerId: this.customer.id,
      initialBalance: formValue.initialBalance,
      accountType: accountType
    };

    this.accountsService.createAccount(newAccount).subscribe({
      next: () => {
        alert('Account created successfully!');
        this.loadCustomerAccounts();
        this.newAccountFormGroup.reset();
        this.showCreateAccountForm = false;
      },
      error: err => {
        this.errorMessage = err.message;
      }
    });
  }

  handleAccountOperations(account: BankAccount) {
    this.router.navigateByUrl('/accounts', { state: { accountId: account.id } });
  }

  getTotalBalance(accounts: BankAccount[] | null): number {
    if (!accounts) return 0;
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }

  handleDeleteAccount(account: BankAccount) {
    if (confirm(`Are you sure you want to delete this account (${account.id.substring(0, 18)}...)?`)) {
      this.accountsService.deleteAccount(account.id).subscribe({
        next: () => {
          alert('Account deleted successfully!');
          this.loadCustomerAccounts();
        },
        error: err => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}
