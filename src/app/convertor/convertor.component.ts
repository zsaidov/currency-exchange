import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ICurrency } from "../models";

@Component({
  selector: 'app-convertor',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './convertor.component.html',
  styleUrl: './convertor.component.scss'
})
export class ConvertorComponent {
  currencySymbols: ICurrency[] = [
    {code: 'steak-0', name: 'Steak'},
    {code: 'pizza-1', name: 'Pizza'},
    {code: 'tacos-2', name: 'Tacos'},
  ];
}
