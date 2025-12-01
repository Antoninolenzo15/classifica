import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../../type/players';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClassificaService {
  private readonly STORAGE_KEY = 'classifica_players';

  private players: Player[] = [];

  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadFromStorage() {
    if (this.isBrowser()) {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        this.players = JSON.parse(savedData);
      }
    }

    // Se non ci sono dati nel localStorage, carica i dati iniziali
    if (!this.players || this.players.length === 0) {
      this.players = [
        { id: 1, position: 1, name: 'CORVETTA', points: 0 },
        { id: 2, position: 2, name: 'CARMINE IOPPOLO', points: 0 },
        { id: 3, position: 3, name: 'CRISTIAN ARENA', points: 0 },
        { id: 4, position: 4, name: 'WILLIAM IUCULANO', points: 0 },
        { id: 5, position: 5, name: 'SAMUELE MASI', points: 0 },
        { id: 6, position: 6, name: 'LUCA RINALDO', points: 0 },
        { id: 7, position: 7, name: 'CICCIO MUTA', points: 0 },
        { id: 8, position: 8, name: 'SANTO SPINELLA', points: 0 },
        { id: 9, position: 9, name: 'DAVIDE MIRACOLA', points: 0 },
        { id: 10, position: 10, name: 'MATTIA BRUNO', points: 0 },
        { id: 11, position: 11, name: 'MANUEL IUCULANO', points: 0 },
        { id: 12, position: 12, name: 'CALOGERO CONTENTA', points: 0 },
        { id: 13, position: 13, name: 'MARCO BRUNO', points: 0 },
      ];
    }

    this.updateRanking();
  }

  private saveToStorage() {
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.players));

      this.http.post('https://classifica-two.vercel.app/api/data', this.players).subscribe((response) => console.log(response));
    }
  }

  getPlayersObservable(): Observable<Player[]> {
    return this.players$;
  }

  addPlayer(name: string): void {
    const newId = Math.max(...this.players.map((p) => p.id)) + 1;
    this.players.push({ id: newId, position: 0, name: name.toUpperCase(), points: 0 });
    this.updateRanking();
  }

  removePlayer(id: number): void {
    this.players = this.players.filter((p) => p.id !== id);
    this.updateRanking();
  }

  addPoints(id: number, points: number): void {
    const player = this.players.find((p) => p.id === id);
    if (player) {
      player.points += points;
      this.updateRanking();
    }
  }

  removePoints(id: number, points: number): void {
    const player = this.players.find((p) => p.id === id);
    if (player) {
      player.points = Math.max(0, player.points - points);
      this.updateRanking();
    }
  }

  private updateRanking(): void {
    // Ordina per punti decrescenti, random se due giocatori hanno stessi punti
    this.players.sort((a, b) => {
      if (b.points === a.points) return Math.random() < 0.5 ? -1 : 1;
      return b.points - a.points;
    });

    // Assegna posizioni uniche
    this.players.forEach((player, index) => {
      player.position = index + 1;
    });

    // Salva su localStorage
    this.saveToStorage();

    // Notifica tutti i componenti
    this.playersSubject.next([...this.players]);
  }
}
