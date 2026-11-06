import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavService } from '../../../services/nav-service';
import { NavItem } from '../../../models/nav-item';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.css',
})
export class AdminNav implements OnInit {
  navLinks = signal<NavItem[] | null>(null);

  constructor(private navService: NavService) {}

  ngOnInit(): void {
    this.loadNav();
  }

  loadNav() {
    this.navService.getAdminNav().subscribe({
      next: (response) => {
        this.navLinks.set(response);
      },
    });
  }
}
