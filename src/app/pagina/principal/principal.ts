import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal {
  prompt: string = '';
  resultadoVisivel = false;

  // valores simulados
  aguaGasta = '0.5L';
  energiaGasta = '1.5 Wh';
  consumoOtimizado = '0.1L | 0.3Wh';
  economiaTotal = '80%';

  analisarImpacto() {
    if (!this.prompt.trim()) {
      alert('Cole seu prompt antes de analisar.');
      return;
    }

    // Aqui você pode adicionar lógica de análise real. Por enquanto simulamos:
    this.resultadoVisivel = true;
  }
}
