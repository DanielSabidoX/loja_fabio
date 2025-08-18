import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user.type';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (!username) {
      this.error = 'Usuário não está logado.';
      this.loading = false;
      return;
    }

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.username === username) || null;
        if (!this.user) {
          this.error = 'Usuário não encontrado.';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar dados do usuário.';
        this.loading = false;
      }
    });
  }
}
