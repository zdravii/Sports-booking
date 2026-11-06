import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNav } from '../../layout/admin-nav/admin-nav';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminNav],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
