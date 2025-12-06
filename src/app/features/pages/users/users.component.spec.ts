import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const mockUsers = [
  {
    id: 1,
    username: 'user1',
    name: 'Test One',
    email: 'one@test.com',
    phone: '123',
    website: 'site.com',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: { lat: '0', lng: '0' }
    },
    company: { name: 'CompanyA', catchPhrase: '', bs: '' }
  },
  {
    id: 2,
    username: 'user2',
    name: 'Test Two',
    email: 'two@test.com',
    phone: '123',
    website: 'site.com',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: { lat: '0', lng: '0' }
    },
    company: { name: 'CompanyB', catchPhrase: '', bs: '' }
  },
  {
    id: 3,
    username: 'user3',
    name: 'Test three',
    email: 'three@test.com',
    phone: '123',
    website: 'site.com',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: { lat: '0', lng: '0' }
    },
    company: { name: 'CompanyC', catchPhrase: '', bs: '' }
  },
  {
    id: 4,
    username: 'user4',
    name: 'Other',
    email: 'other@test.com',
    phone: '123',
    website: 'site.com',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: { lat: '0', lng: '0' }
    },
    company: { name: 'CompanyD', catchPhrase: '', bs: '' }
  }
];

class ApiMock {
  getUsers() {
    return of(mockUsers);
  }
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, CommonModule, FormsModule],
      providers: [{ provide: ApiService, useClass: ApiMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(component.users().length).toBe(4);
  });

  it('should filter by name or email', () => {
    component.setFilterNameOrEmail('two');
    expect(component.filtered().length).toBe(1);
    expect(component.filtered()[0].email).toBe('two@test.com');
  });

  it('should filter by company', () => {
    component.setFilterCompany('CompanyC');
    expect(component.filtered().length).toBe(1);
    expect(component.filtered()[0].company.name).toBe('CompanyC');
  });

  it('should open and close sidebar', () => {
    const user = mockUsers[0];

    component.openSidebar(user);
    expect(component.selectedUser()).toEqual(user);

    component.closeSidebar();
    expect(component.selectedUser()).toBeNull();
  });

  it('should paginate next/prev correctly', () => {
    component.page.set(1);
    component.pageSize = 1;

    component.next();
    expect(component.page()).toBe(2);

    component.prev();
    expect(component.page()).toBe(1);
  });
});
