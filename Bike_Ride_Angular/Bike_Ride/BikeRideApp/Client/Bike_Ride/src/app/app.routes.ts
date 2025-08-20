import { Routes } from '@angular/router';
import { BikeBoard } from './features/bikesCs/bike-board/bike-board';
import { NotFound } from './shared/components';
import { Profile } from './features/profile/profile';
import { BikeContent } from './features/bikesCs';

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
    path: 'bike-content/:id',
    // component: BikeContent
    loadComponent: () => import('./features/bikesCs/bike-content/bike-content').then(c => c.BikeContent)
},
{
    path: 'mostPopular', 
    loadComponent: () => import('./features/bikesCs/bike-most-popular/bike-most-popular').then(c => c.BikeMostPopular) },
{
    path: 'add-bike', 
    loadComponent: () => import('./features/bikesCs/new-bike/new-bike').then(c => c.NewBike) },
{
    path: 'edit-bike/:id', 
    loadComponent: () => import('./features/bikesCs/edit-bike/edit-bike').then(c => c.EditBike) },
{
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile').then(c => c.Profile) },
{
    path: 'profile/:id',
    component: Profile
    // loadComponent: () => import('./features/profile/profile').then(c => c.Profile)
},
//{
//     path: 'bike-test-ride', 
//     loadComponent: () => import('./features/book-ride/book-ride').then(c => c.BookRide) },
{
    path: 'logout', 
    redirectTo: '/home', 
    pathMatch: 'full'},
{
    path: '**', 
    component: NotFound }];
