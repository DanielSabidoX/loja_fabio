import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

// Validator de confirmação de senha (no FormGroup)
const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // <- use plural "styleUrls"
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator }
    );
  }

  // Acesso prático aos controles no template
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitError = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.registerForm.value;

    // Monta payload sem confirmPassword
    const newUser = {
      username: v.username,
      email: v.email,
      password: v.password
    };

    this.userService.createUser(newUser).subscribe({
      next: (user) => {
        if (!user) {
          this.submitError = 'Não foi possível concluir o registro. Tente novamente.';
          return;
        }

      this.registerForm.reset(); // limpa o formulário
      // opcional: limpa estados de validação
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.controls[key].setErrors(null);
      });        

        // Opcional: já manter logado/guardado
        //this.userService.setCurrentUser(user);
        //this.router.navigate(['/user']);
      },
      error: () => {
        this.submitError = 'Erro ao registrar. Tente novamente.';
      },
      complete: () => (this.loading = false)
    });
  }
}
