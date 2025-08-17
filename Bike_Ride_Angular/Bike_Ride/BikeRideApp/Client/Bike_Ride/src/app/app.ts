import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, ErrorNotification, NotFound} from './shared/components';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
            Footer, 
            Header,
            ErrorNotification, NotFound],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Bike_Ride');
}
