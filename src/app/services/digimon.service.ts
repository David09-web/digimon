import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DigimonResponse, DigimonDetail } from '../interfaces/digimon.interface';

@Injectable({
  providedIn: 'root'
})
export class DigimonService {
  private baseUrl = 'https://digi-api.com/api/v1/digimon';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista paginada de Digimons
   * @param page Número de página (0-indexed)
   * @param pageSize Cantidad de elementos por página (por defecto 50)
   */
  getDigimons(page: number = 0, pageSize: number = 50): Observable<DigimonResponse> {
    return this.http.get<DigimonResponse>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Busca Digimons por su nombre (permite búsquedas parciales)
   * @param name Nombre del Digimon a buscar
   * @param page Número de página
   * @param pageSize Cantidad de elementos
   */
  searchDigimons(name: string, page: number = 0, pageSize: number = 50): Observable<DigimonResponse> {
    return this.http.get<DigimonResponse>(`${this.baseUrl}?name=${encodeURIComponent(name)}&page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Obtiene los detalles avanzados de un Digimon específico mediante su ID o Nombre exacto
   * @param idOrName ID del Digimon o nombre exacto
   */
  getDigimonDetail(idOrName: number | string): Observable<DigimonDetail> {
    return this.http.get<DigimonDetail>(`${this.baseUrl}/${idOrName}`);
  }
}
