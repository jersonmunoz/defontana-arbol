import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {        /*Servicio para inyectar en componentes para conectar frontend con endpoint entregado*/
  private url: string;
  constructor(private http :HttpClient) {   
    this.url = GLOBAL.url;              /*Utiliziación de url definida en Global.ts */
  }
  getJSONData() {
    return this.http.get(this.url);     /*Utilización de HttpClient para obtener los datos desde el endpoint*/
  }
}
