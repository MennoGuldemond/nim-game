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
    if (this.isNimSumEven(this.stapels)) {
      // Doe random zet, de computer kan niet winnen.
      console.log('De computer kon geen winnende zet doen.');
    } else {
      for (let i = 0; i < this.stapels.length; i++) {
        const testStapelFichces = this.getDummyArray(this.stapels[i]);
        for (let j = 1; j <= testStapelFichces.length; j++) {
          // Na elke fich verwijderen, checken of we een winnende staat hebben.
          const testStapels = this.stapels;
          testStapels[i] = testStapels[i] - j;
          if (this.isNimSumEven(testStapels)) {
            console.log('De computer heeft een winnende zet gevonden.');
            console.log(testStapels);
          }
        }
      }
    }
  }

  isNimSumEven(stapelStaat: number[]): boolean {
    // Zet stapel lengtes om naar binaire getallen
    const binaireStapels = [];
    for (let i = 0; i < stapelStaat.length; i++) {
      binaireStapels.push(this.getalNaarBinair(stapelStaat[i]));
    }
    // console.log(binaireStapels);

    // Tel alle binaire getallen bij elkaar op zonder 'restwaarde'.
    const indexOneven = [false, false, false, false];

    for (let i = 3; i >= 0; i--) {
      indexOneven[i] = this.isIndexOneven(binaireStapels, i);
    }

    // console.log(indexOneven);
    return indexOneven.every((x) => x === false);
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

  getDummyArray(aantal: number): any[] {
    let array = [];
    for (let i = 0; i < aantal; i++) {
      array[i] = i;
    }
    return array;
  }
}
