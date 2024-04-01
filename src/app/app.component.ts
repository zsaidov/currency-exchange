import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConvertorComponent } from "./convertor/convertor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConvertorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-exchange';
}
