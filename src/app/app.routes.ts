import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ReservationList } from './components/reservation-list/reservation-list';
import { CenterManagement } from './components/admin/center/center-management/center-management';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { CenterDetails } from './components/center-details/center-details';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { SportManagement } from './components/admin/sport/sport-management/sport-management';
import { CourtManagement } from './components/admin/court/court-management/court-management';
import { UserManagement } from './components/admin/user-management/user-management';
import { ReservationManagement } from './components/admin/reservation-management/reservation-management';
import { CenterCreate } from './components/admin/center/center-create/center-create';
import { CenterEdit } from './components/admin/center/center-edit/center-edit';
import { SportCreate } from './components/admin/sport/sport-create/sport-create';
import { SportEdit } from './components/admin/sport/sport-edit/sport-edit';
import { CourtDetails } from './components/court-details/court-details';
import { CourtCreate } from './components/admin/court/court-create/court-create';
import { CourtEdit } from './components/admin/court/court-edit/court-edit';
import { AuditLog } from './components/admin/audit-log/audit-log';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'center/:id', component: CenterDetails },
  { path: 'court/:id', component: CourtDetails },
  { path: 'reservations', component: ReservationList, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'centers', component: CenterManagement },
      { path: 'centers/create', component: CenterCreate },
      { path: 'centers/edit/:id', component: CenterEdit },
      { path: 'sports', component: SportManagement },
      { path: 'sports/create', component: SportCreate },
      { path: 'sports/edit/:id', component: SportEdit },
      { path: 'courts', component: CourtManagement },
      { path: 'courts/create', component: CourtCreate },
      { path: 'courts/edit/:id', component: CourtEdit },
      { path: 'users', component: UserManagement },
      { path: 'reservations', component: ReservationManagement },
      { path: 'auditLogs', component: AuditLog },
      { path: '', redirectTo: 'centers', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
