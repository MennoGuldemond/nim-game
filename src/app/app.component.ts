import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  minStapels = 1;
  minFiches = 1;
  maxStapels = 5;
  maxFiches = 10;

  gameForm = new FormGroup({
    aantalStapels: new FormControl(this.minStapels),
    stapels: new FormArray([new FormControl(this.minFiches)]),
  });

  constructor(
    public gameState: GameStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.minStapels = +params['minStapels'] || 1;
      this.minFiches = +params['minFiches'] || 1;
      this.maxStapels = +params['maxStapels'] || 5;
      this.maxFiches = +params['maxFiches'] || 10;

      this.gameForm.controls.aantalStapels.setValue(this.minStapels);
      this.gameForm.controls.aantalStapels.setValidators([
        Validators.required,
        Validators.min(this.minStapels),
        Validators.max(this.maxStapels),
      ]);

      for (let i = 0; i < this.gameForm.controls.stapels.controls.length; i++) {
        this.gameForm.controls.stapels.controls[i].setValidators([
          Validators.required,
          Validators.min(this.minFiches),
          Validators.max(this.maxFiches),
        ]);
      }
    });

    this.gameForm.controls.aantalStapels.valueChanges.subscribe((aantal) => {
      if (aantal) {
        const newFishes = new FormArray([]);
        for (let i = 0; i < aantal; i++) {
          newFishes.push(
            new FormControl(this.minFiches, [
              Validators.required,
              Validators.min(this.minFiches),
              Validators.max(this.maxFiches),
            ])
          );
        }
        this.gameForm.controls.stapels = newFishes;
      }
    });
  }

  onClickedStart(): void {
    if (this.gameForm.valid) {
      const formValue = this.gameForm.getRawValue();
      this.gameState.start(formValue.aantalStapels, formValue.stapels);
    }
  }

  onFicheClicked(stapelNummer: number, fichNummer: number): void {
    if (this.gameState.isSpelersBeurt) {
      this.gameState.verwijderFiches(stapelNummer, fichNummer + 1);
    }
  }

  onClickRandom(): void {
    const aantalStapels = this.gameState.getRandomInt(
      this.maxStapels,
      this.minStapels
    );
    this.gameForm.controls.aantalStapels.setValue(aantalStapels);
    setTimeout(() => {
      for (let i = 0; i < this.gameForm.controls.stapels.controls.length; i++) {
        const aantalFiches = this.gameState.getRandomInt(
          this.maxFiches,
          this.minFiches
        );
        this.gameForm.controls.stapels.controls[i].setValue(aantalFiches);
      }
    }, 10);
  }
}
