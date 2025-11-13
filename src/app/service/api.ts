import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnaliseSustentabilidade } from '../pagina/principal/IPrincipal';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  getDadosConsumo(): Observable<AnaliseSustentabilidade[]> {
    const body = { texto: prompt };
    const apiUrl = "http://127.0.0.1:8000/analise";
    return this.http.post<AnaliseSustentabilidade[]>(apiUrl, body);
  }
}
