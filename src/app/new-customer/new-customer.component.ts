import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  handleSaveCustomer() {
    if (this.newCustomerFormGroup.invalid) return;
    
    let customer: Customer = this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
      next: data => {
        alert('Customer has been successfully saved!');
        this.router.navigateByUrl('/customers');
      },
      error: err => {
        console.log(err);
        alert('Error saving customer');
      }
    });
  }
}
