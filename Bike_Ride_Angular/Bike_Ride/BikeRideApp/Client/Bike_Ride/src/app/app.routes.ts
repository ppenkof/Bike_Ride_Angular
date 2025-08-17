import { Routes } from '@angular/router';
import { BikeBoard } from './features/bikesCs/bike-board/bike-board';
import { NotFound } from './shared/components';

export const routes: Routes = [{
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full'
},
{
    path: 'home', 
    loadComponent: () => import('./features/home/home').then(c => c.Home) },
{
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login) },
{
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(c => c.Register) },
{
    path: 'bikes', 
    loadComponent: () => import('./features/bikesCs/bike-board/bike-board').then(c => c.BikeBoard) },
{
    path: 'bikes/:id',
    component: BikeBoard
    // loadComponent: () => import('./features/themes/theme-content/theme-content').then(c => c.ThemeContent)
},
{
    path: 'add-bike', 
    loadComponent: () => import('./features/bikesCs/new-bike/new-bike').then(c => c.NewBike) },
{
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile').then(c => c.Profile) },
{
    path: 'logout', 
    redirectTo: '/home', 
    pathMatch: 'full'},
{
    path: '**', 
    component: NotFound }];
