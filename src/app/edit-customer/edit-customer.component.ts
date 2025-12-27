import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormGroup!: FormGroup;
  customerId!: number;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];
    
    this.editCustomerFormGroup = this.fb.group({
      id: [this.customerId],
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadCustomer();
  }

  loadCustomer() {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer: Customer) => {
        this.editCustomerFormGroup.patchValue({
          name: customer.name,
          email: customer.email
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        alert('Error loading customer');
      }
    });
  }

  handleUpdateCustomer() {
    if (this.editCustomerFormGroup.invalid) return;
    
    let customer: Customer = this.editCustomerFormGroup.value;
    this.customerService.updateCustomer(customer).subscribe({
      next: () => {
        alert('Customer updated successfully!');
        this.router.navigateByUrl('/customers');
      },
      error: (err) => {
        console.log(err);
        alert('Error updating customer');
      }
    });
  }
}
