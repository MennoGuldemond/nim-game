import { Injectable } from '@angular/core';
import { Zet } from '../models/zet';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  aantalStapels: number = 0;
  stapels: number[] = [];
  isSpelersBeurt: boolean = true;
  isActief: boolean;
  gameOver: boolean;
  resultaatTekst: string;
  computerZet: Zet;
  beginSituatie: number[];
  isFrans: boolean;

  start(aantalStapels: number, stapels: number[]): void {
    this.isActief = true;
    this.isSpelersBeurt = true;
    this.aantalStapels = aantalStapels;
    this.stapels = stapels;
  }

  verwijderFiches(stapelNummer: number, verwijderAantal: number): void {
    if (this.isFrans && verwijderAantal > 3) {
      return;
    }

    if (!this.gameOver) {
      this.stapels[stapelNummer] = this.stapels[stapelNummer] - verwijderAantal;

      // Check of het spel afgelopen is
      if (this.stapels.every((x) => +x < 1)) {
        this.gameOver = true;
        if (this.isSpelersBeurt) {
          console.log('Gewonnen!');
          this.resultaatTekst = 'Je hebt gewonnen!';
        } else {
          console.log('Verloren =(');
          this.resultaatTekst = 'Je hebt verloren =(';
        }
        return;
      }

      this.isSpelersBeurt = !this.isSpelersBeurt;

      if (!this.isSpelersBeurt) {
        this.computerBeurt();
      }
    }
  }

  computerBeurt(): void {
    if (this.isFrans) {
      const rest = this.stapels[0] % 4;
      if (rest === 0) {
        this.computerZet = new Zet(0, this.getRandomInt(4));
      } else {
        this.computerZet = new Zet(0, rest);
      }
      return;
    }

    if (this.isNimSumEven(this.stapels)) {
      console.log('De computer kon geen winnende zet doen.');
      // Kies random zet, de computer kan niet winnen.
      // Maar kies niet uit lege stapes.
      const dummyStapels = this.stapels.filter((x) => x > 0);
      const kiesConditieNummer =
        dummyStapels[this.getRandomInt(0, dummyStapels.length)];
      const gekozenStapel = this.stapels.indexOf(kiesConditieNummer);
      const aantal = this.getRandomInt(this.stapels[gekozenStapel] + 1);
      this.computerZet = new Zet(gekozenStapel, aantal);
      console.log(this.computerZet);
    } else {
      for (let i = 0; i < this.stapels.length; i++) {
        const testStapelFichces = this.getDummyArray(this.stapels[i]);
        for (let j = 1; j <= testStapelFichces.length; j++) {
          // Na elke fiche verwijderen, checken of we een winnende staat hebben.
          const testStapels = [...this.stapels];
          testStapels[i] = testStapels[i] - j;
          // console.log(`check stapel: ${i}, fiche: ${j}`);
          if (this.isNimSumEven(testStapels)) {
            console.log('De computer heeft een winnende zet gevonden.');
            this.computerZet = new Zet(i, j);
            return;
          }
        }
      }
    }
  }

  computerZetUitvoeren(): void {
    if (this.computerZet) {
      this.verwijderFiches(
        this.computerZet.stapelNummer,
        this.computerZet.aantalFiches
      );
      this.computerZet = null;
    }
  }

  isNimSumEven(stapelStaat: number[]): boolean {
    // Zet stapel lengtes om naar binaire getallen
    const binaireStapels = [];
    for (let i = 0; i < stapelStaat.length; i++) {
      binaireStapels.push(this.getalNaarBinair(stapelStaat[i]));
    }

    // Tel alle binaire getallen bij elkaar op zonder 'restwaarde'.
    const indexOneven = [false, false, false, false];

    for (let i = 3; i >= 0; i--) {
      indexOneven[i] = this.isIndexOneven(binaireStapels, i);
    }

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

  VerwijderRandomFiche(): void {
    const gekozenStapel = this.getRandomInt(this.stapels.length);
    this.verwijderFiches(
      gekozenStapel,
      this.getRandomInt(this.stapels[gekozenStapel] + 1)
    );
  }

  /** Max is exclusief */
  getRandomInt(max: number, min: number = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  eindigSpel(): void {
    if (this.beginSituatie || this.isFrans) {
      location.reload();
    }
    this.isActief = false;
    this.gameOver = false;
  }
}
