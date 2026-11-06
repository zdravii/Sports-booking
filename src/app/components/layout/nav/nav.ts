import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { NavService } from '../../../services/nav-service';
import { NavItem } from '../../../models/nav-item';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  navLinks = signal<NavItem[] | null>(null);

  constructor(
    public authService: Auth,
    private router: Router,
    private navService: NavService,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadNav();
  }

  loadNav() {
    this.navService.getMainNav().subscribe({
      next: (response) => {
        this.navLinks.set(response);
      },
    });
  }

  get visibleNavLinks(): NavItem[] | undefined{
    const loggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole();

    return this.navLinks()?.filter((item) => {
      if (item.requredAuth && !loggedIn) return false;
      if (item.requiresRole && item.requiresRole != role) return false;
      return true;
    });
  }

  onNavClick(item:NavItem):void{
    if(item.action === 'logout'){
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
