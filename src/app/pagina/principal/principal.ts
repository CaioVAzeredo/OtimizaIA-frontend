import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnaliseSustentabilidade } from './IPrincipal';
import { ApiService } from '../../service/api';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal implements OnInit {
  resposta: AnaliseSustentabilidade[] = []
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getDadosConsumo().subscribe(res => {
      this.resposta = res;
    });
  }
}