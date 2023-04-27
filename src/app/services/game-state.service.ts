import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  aantalStapels: number = 0;
  stapels: number[] = [];
  isSpelersBeurt: boolean = true;
  isActief: boolean = false;

  start(aantalStapels: number, stapels: number[]): void {
    this.isActief = true;
    this.isSpelersBeurt = true;
    this.aantalStapels = aantalStapels;
    this.stapels = stapels;
  }

  verwijderFiches(stapelNummer: number, verwijderAantal: number): void {
    this.stapels[stapelNummer] = this.stapels[stapelNummer] - verwijderAantal;
    this.isSpelersBeurt = !this.isSpelersBeurt;

    if (!this.isSpelersBeurt) {
      this.computerZet();
    }
  }

  computerZet(): void {
    // Zet stapel lengtes om naar binaire getallen
    const binaireStapels = [];
    for (let i = 0; i < this.stapels.length; i++) {
      binaireStapels.push(this.getalNaarBinair(this.stapels[i]));
    }

    console.log(binaireStapels);

    // Wat is de NIM sum?
    // Tel alle binaire getallen bij elkaar op zonder 'restwaarde'.
    const indexOneven = [false, false, false, false];

    for (let i = 3; i >= 0; i--) {
      indexOneven[i] = this.isIndexOneven(binaireStapels, i);
    }

    console.log(indexOneven);
  }

  getalNaarBinair(getal): any {
    return (getal >>> 0).toString(2).padStart(4, '0');
  }

  isIndexOneven(binaireStapels: string[], index: number): boolean {
    let som = 0;
    for (let i = 0; i < binaireStapels.length; i++) {
      som += +binaireStapels[i].charAt(index);
    }
    return som % 2 !== 0;
  }
}
