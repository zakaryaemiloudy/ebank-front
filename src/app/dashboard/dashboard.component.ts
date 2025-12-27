import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AccountsService } from '../services/accounts.service';
import { BankAccount } from '../model/account.model';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalAccounts = 0;
  totalBalance = 0;
  savingAccounts = 0;
  currentAccounts = 0;
  customers: Customer[] = [];
  recentAccounts: BankAccount[] = [];

  constructor(
    private customerService: CustomerService,
    private accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.customerService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.totalCustomers = customers.length;
        this.customers = customers;
      }
    });

    this.accountsService.getAllAccounts().subscribe({
      next: (accounts: BankAccount[]) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        this.savingAccounts = accounts.filter(a => a.type === 'SavingAccount').length;
        this.currentAccounts = accounts.filter(a => a.type === 'CurrentAccount').length;
        this.recentAccounts = accounts.slice(0, 5);
      }
    });
  }

  getSavingPercentage(): number {
    if (this.totalAccounts === 0) return 0;
    return (this.savingAccounts / this.totalAccounts) * 100;
  }

  getCurrentPercentage(): number {
    if (this.totalAccounts === 0) return 0;
    return (this.currentAccounts / this.totalAccounts) * 100;
  }
}
