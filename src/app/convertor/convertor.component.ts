import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ICurrency } from "../models";
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { ConvertorService } from "./convertor.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs";

@Component({
  selector: 'app-convertor',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatGridListModule, MatIconButton, ReactiveFormsModule, NgOptimizedImage,],
  templateUrl: './convertor.component.html',
  styleUrl: './convertor.component.scss'
})
export class ConvertorComponent implements OnInit {
  readonly currencySymbols: ICurrency[] = [
    {code: 'RUB', name: 'RUB'},
    {code: 'USD', name: 'USD'},
    {code: 'EUR', name: 'EUR'},
    {code: 'GBP', name: 'GBP'},
  ];
  readonly form: UntypedFormGroup = new UntypedFormGroup({
    fromAmount: new FormControl(null, Validators.required),
    fromAmountCurrency: new FormControl('USD', Validators.required),
    toAmount: new FormControl(null),
    toAmountCurrency: new FormControl('RUB', Validators.required),
  });
  rates: { [key: string]: string } = {};

  constructor(private readonly service: ConvertorService,
              private readonly destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.getCurrentRate();

    this.changeFromAmount()
    this.changeToAmount()

    this.form.get('fromAmountCurrency')
      ?.valueChanges
      .pipe(
        switchMap(value => this.service.getRates(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        this.rates = res.rates;
        this.calculateToAmount(this.form.get('toAmount')?.value)
      });

    this.form.get('toAmountCurrency')
      ?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calculateToAmount(this.form.get('fromAmount')?.value)
      });
  }

  swap(): void {
    const {fromAmountCurrency, toAmountCurrency, fromAmount, toAmount} = this.form.value;
    this.form.patchValue({
        fromAmountCurrency: toAmountCurrency,
        toAmountCurrency: fromAmountCurrency,
        fromAmount: toAmount,
        toAmount: fromAmount
      }, {emitEvent: false}
    );
    this.getCurrentRate();
  }

  private changeFromAmount(): void {
    this.form.get('fromAmount')
      ?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => {
      if (value !== null) {
        this.calculateToAmount(value);
      }
    });
  }

  private changeToAmount(): void {
    this.form.get('toAmount')
      ?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => {
      if (value !== null) {
        this.calculateFromAmount(value);
      }
    });
  }

  private getCurrentRate(): void {
    const fieldValue = this.form.get('fromAmountCurrency')?.value;
    this.service.getRates(fieldValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.rates = res.rates;
      })
  }

  private calculate(amount: number, currency: string): number {
    const val = +this.rates[currency]
    return roundTwoDecimal(val * amount);
  }

  private calculateToAmount(value: number): void {
    const fieldValue = this.form.get('toAmountCurrency')?.value;
    const sum = this.calculate(value, fieldValue);
    this.form.get('toAmount')?.patchValue(sum, {emitEvent: false});
  }

  private calculateFromAmount(value: number): void {
    const fieldValue = this.form.get('toAmountCurrency')?.value;
    const rate = +this.rates[fieldValue]
    const sum = roundTwoDecimal(value / rate);
    this.form.get('fromAmount')?.patchValue(sum, {emitEvent: false});
  }
}

export function roundTwoDecimal(amount: number): number {
  const sum = +(amount + Number.EPSILON * 100).toPrecision(15);
  return Math.round(sum * 100) / 100;
}
