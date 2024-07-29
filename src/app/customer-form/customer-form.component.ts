import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerId = +id;
        this.customerService.getCustomerById(this.customerId).subscribe(customer => {
          this.customerForm.patchValue(customer);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      if (this.customerId) {
        customer.id = this.customerId;
        this.customerService.updateCustomer(customer).subscribe(() => {
          alert('Customer updated successfully');
          this.router.navigate(['/customers']);
        });
      } else {
        this.customerService.addCustomer(customer).subscribe(() => {
          alert('Customer added successfully');
          this.router.navigate(['/customers']);
        });
      }
    }
  }
}
