import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountsService } from '../services/accounts.service';
import { AccountDetails, AccountStatus } from '../model/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;
  errorMessage!: string;
  AccountStatusEnum = AccountStatus;

  constructor(private fb: FormBuilder, private accountService: AccountsService) {}

  ngOnInit(): void {
    const state = history.state;
    const accountId = state?.accountId || '';

    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control(accountId)
    });
    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });

    if (accountId) {
      this.handleSearchAccount();
    }
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    if (!accountId || accountId.trim() === '') {
      this.errorMessage = 'Please enter an account ID';
      return;
    }
    this.errorMessage = '';
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFromGroup.value.operationType;
    let amount: number = this.operationFromGroup.value.amount;
    let description: string = this.operationFromGroup.value.description;
    let accountDestination: string = this.operationFromGroup.value.accountDestination;

    if (!operationType) {
      alert('Please select an operation type');
      return;
    }

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: (data: any) => {
          alert('Debit operation successful!');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err: any) => {
          console.log(err);
          alert('Error: ' + (err.error?.message || err.message));
        }
      });
    } else if (operationType == 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data: any) => {
          alert('Credit operation successful!');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err: any) => {
          console.log(err);
          alert('Error: ' + (err.error?.message || err.message));
        }
      });
    } else if (operationType == 'TRANSFER') {
      if (!accountDestination || accountDestination.trim() === '') {
        alert('Please enter a destination account');
        return;
      }
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data: any) => {
          alert('Transfer operation successful!');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err: any) => {
          console.log(err);
          alert('Error: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
