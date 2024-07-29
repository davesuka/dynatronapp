import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data: Customer[]) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/edit-customer/', customer.id]);
  }

  addCustomer(): void {
    this.router.navigate(['/add-customer']);
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(
        () => {
          this.loadCustomers();
          if (this.selectedCustomer && this.selectedCustomer.id === id) {
            this.selectedCustomer = null;
            sessionStorage.removeItem('selectedCustomer');
          }
        },
        (error) => {
          console.error('Error deleting customer:', error);
        }
      );
    }
  }
}
