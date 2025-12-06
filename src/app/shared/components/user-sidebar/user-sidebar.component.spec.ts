import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSidebarComponent } from './user-sidebar.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../features/models/user.model';
import { Post } from '../../../features/models/post.model';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  username: 'tester',
  email: 'test@test.com',
  phone: '123',
  website: 'site.com',
  address: {
    street: '',
    suite: '',
    city: 'Córdoba',
    zipcode: '5000',
    geo: { lat: '0', lng: '0' }
  },
  company: {
    name: 'TestCorp',
    catchPhrase: '',
    bs: ''
  }
};

const mockPosts: Post[] = [
  { userId: 1, id: 1, title: 'Post1', body: 'Body1' },
  { userId: 1, id: 2, title: 'Post2', body: 'Body2' },
  { userId: 1, id: 3, title: 'Post3', body: 'Body3' },
  { userId: 1, id: 4, title: 'Post4', body: 'Body4' },
  { userId: 1, id: 5, title: 'Post5', body: 'Body5' },
  { userId: 1, id: 6, title: 'Post6', body: 'Body6' }
];

class ApiMock {
  getPostsByUser(id: number) {
    return of(mockPosts);
  }
}

describe('UserSidebarComponent', () => {
  let component: UserSidebarComponent;
  let fixture: ComponentFixture<UserSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSidebarComponent, CommonModule],
      providers: [{ provide: ApiService, useClass: ApiMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeSidebar when onCloseSidebar is called', () => {
    spyOn(component.closeSidebar, 'emit');
    component.onCloseSidebar();
    expect(component.closeSidebar.emit).toHaveBeenCalled();
  });

  it('should load posts when user input is set', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(component.posts().length).toBe(mockPosts.length);
  });

  it('should return last five posts', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const lastFive = component.lastFive();

    expect(lastFive.length).toBe(5);
    expect(lastFive[0].title).toBe('Post1');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(UserSidebarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Latest notes');
  });
});
