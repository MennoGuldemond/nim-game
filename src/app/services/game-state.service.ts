import { Injectable } from '@angular/core';

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
  computerBeurtTijd = 1000;

  start(aantalStapels: number, stapels: number[]): void {
    this.isActief = true;
    this.isSpelersBeurt = true;
    this.aantalStapels = aantalStapels;
    this.stapels = stapels;
  }

  verwijderFiches(stapelNummer: number, verwijderAantal: number): void {
    console.log('staat', this.stapels);
    // console.log('stapel', stapelNummer);
    // console.log('verwijderAantal', verwijderAantal);

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
        setTimeout(() => {
          this.computerZet();
        }, this.computerBeurtTijd);
      }
    }
  }

  computerZet(): void {
    if (this.isNimSumEven(this.stapels)) {
      console.log('De computer kon geen winnende zet doen.');
      // Doe random zet, de computer kan niet winnen.
      this.VerwijderRandomFiche();
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
            this.verwijderFiches(i, j);
            return;
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

  getRandomInt(max: number, min: number = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  eindigSpel(): void {
    this.isActief = false;
    this.gameOver = false;
  }
}
