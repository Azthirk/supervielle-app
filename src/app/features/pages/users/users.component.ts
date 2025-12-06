import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service'; 
import { UserSidebarComponent } from '../../../shared/components/user-sidebar/user-sidebar.component'; 
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, UserSidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users = signal<User[]>([]);
  search = signal('');
  companyFilter = signal('');
  page = signal(1);
  pageSize = 5;

  selectedUser = signal<User | null>(null);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe((data: User[]) => {
      this.users.set(data);
    });
  }

  filtered = computed(() => {
    const term = this.search().toLowerCase();
    const company = this.companyFilter();

    return this.users().filter(u =>
      (u.name.toLowerCase().includes(term) ||
       u.email.toLowerCase().includes(term)) &&
      (company ? u.company.name === company : true)
    );
  });

  paginated = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  companies = computed(() =>
    Array.from(new Set(this.users().map(u => u.company.name)))
  );

  next() {
    if ((this.page() * this.pageSize) < this.filtered().length) {
      this.page.set(this.page() + 1);
    }
  }

  prev() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  openSidebar(user: User) {
    this.selectedUser.set(user);
  }

  closeSidebar() {
    this.selectedUser.set(null);
  }

  setFilterCompany(event: string){
    this.page = signal(1);
    this.companyFilter.set(event);
  }

  setFilterNameOrEmail(event: string){
    this.page = signal(1);
    this.search.set(event)
  }
}
