import { Component, Output, EventEmitter, computed, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../features/models/user.model';
import { Post } from '../../../features/models/post.model';

@Component({
  selector: 'app-user-sidebar',
  imports: [CommonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent {

  user = input<User | null>(null);
  @Output() closeSidebar = new EventEmitter<void>();

  posts = signal<Post[]>([]);

  constructor(private api: ApiService) {
    effect(() => {
      const u = this.user();
      if (!u) return;

      this.api.getPostsByUser(u.id).subscribe(res => {
        this.posts.set(res);
      });
    });
  }

  lastFive = computed(() => this.posts().slice(0, 5));

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }
}
