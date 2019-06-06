
import { DashboardComponent } from './baseScenes/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShadowboardComponent } from './shadowboard/shadowboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'shadowboard', component: ShadowboardComponent },
  { path: '', redirectTo: '/shadowboard', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})




export class AppRoutingModule { }
