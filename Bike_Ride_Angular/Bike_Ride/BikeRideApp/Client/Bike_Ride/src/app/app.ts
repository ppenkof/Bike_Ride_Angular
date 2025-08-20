import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, ErrorNotification, NotFound} from './shared/components';
import { Profile } from './features/profile/profile';
import { BikeContent, BikeMostPopular } from './features/bikesCs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
            Footer, 
            Header,
            ErrorNotification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Bike_Ride');
}
