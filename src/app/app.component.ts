import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  maxStapels = 5;
  maxFiches = 10;

  gameForm = new FormGroup({
    aantalStapels: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxStapels),
    ]),
    stapels: new FormArray([
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxFiches),
      ]),
    ]),
  });
  constructor(public gameState: GameStateService) {}

  ngOnInit(): void {
    this.gameForm.controls.aantalStapels.valueChanges.subscribe((aantal) => {
      if (aantal) {
        const newFishes = new FormArray([]);
        for (let i = 0; i < aantal; i++) {
          newFishes.push(
            new FormControl(1, [
              Validators.required,
              Validators.min(1),
              Validators.max(10),
            ])
          );
        }
        this.gameForm.controls.stapels = newFishes;
      }
    });
  }

  onClickedStart(): void {
    const formValue = this.gameForm.getRawValue();
    this.gameState.start(formValue.aantalStapels, formValue.stapels);
  }

  onFicheClicked(stapelNummer: number, fichNummer: number): void {
    if (this.gameState.isSpelersBeurt) {
      this.gameState.verwijderFiches(stapelNummer, fichNummer + 1);
    }
  }

  onClickRandom(): void {
    const aantalStapels = this.gameState.getRandomInt(this.maxStapels);
    this.gameForm.controls.aantalStapels.setValue(aantalStapels);
    setTimeout(() => {
      for (let i = 0; i < this.gameForm.controls.stapels.controls.length; i++) {
        const aantalFiches = this.gameState.getRandomInt(this.maxFiches);
        this.gameForm.controls.stapels.controls[i].setValue(aantalFiches);
      }
    }, 10);
  }
}
