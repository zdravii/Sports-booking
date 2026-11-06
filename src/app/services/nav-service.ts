import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavItem } from '../models/nav-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  constructor(private http:HttpClient){}

  getMainNav():Observable<NavItem[]>{
    return this.http.get<NavItem[]>('/data/nav.json');
  }

  getAdminNav():Observable<NavItem[]>{
    return this.http.get<NavItem[]>('/data/adminNav.json');
  }
}
