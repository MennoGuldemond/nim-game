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

  onFichClicked(stapelNummer: number, fichNummer: number): void {
    // console.log(`stapel: ${stapelNummer}, Fich: ${fichNummer}`);
    this.gameState.verwijderFiches(stapelNummer, fichNummer + 1);
  }

  getDummyArray(aantal: number): any[] {
    let array = [];
    for (let i = 0; i < aantal; i++) {
      array[i] = i;
    }
    return array;
  }
}
