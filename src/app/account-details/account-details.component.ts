import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { BankAccount, AccountStatus } from '../model/account.model';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  accountId!: string;
  account$!: Observable<BankAccount>;
  errorMessage!: string;
  AccountStatusEnum = AccountStatus;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['id'];
    this.loadAccount();
  }

  loadAccount() {
    this.account$ = this.accountsService.getAccountById(this.accountId).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  handleToggleStatus(currentStatus: AccountStatus) {
    let newStatus: AccountStatus;
    if (currentStatus === AccountStatus.CREATED || currentStatus === AccountStatus.SUSPENDED) {
      newStatus = AccountStatus.ACTIVATED;
    } else {
      newStatus = AccountStatus.SUSPENDED;
    }

    this.accountsService.updateAccountStatus(this.accountId, newStatus.toString()).subscribe({
      next: () => {
        this.loadAccount();
      },
      error: err => {
        this.errorMessage = err.message;
        alert('Error updating account status: ' + err.message);
      }
    });
  }

  handleAccountOperations() {
    this.router.navigateByUrl('/accounts', { state: { accountId: this.accountId } });
  }

  getBadgeClass(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.CREATED: return 'bg-info';
      case AccountStatus.ACTIVATED: return 'bg-success';
      case AccountStatus.SUSPENDED: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
