import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup: FormGroup | undefined;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm('Are you sure you want to delete this customer?');
    if (!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.handleSearchCustomers();
      },
      error: (err: any) => {
        console.log(err);
        alert('Error deleting customer: ' + err.message);
      }
    });
  }

  handleEditCustomer(customer: Customer) {
    this.router.navigateByUrl('/edit-customer/' + customer.id);
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl('/customer-accounts/' + customer.id, { state: customer });
  }
}
