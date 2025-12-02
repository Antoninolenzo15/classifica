import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../../type/players';
import { AuthService } from '../services/auth.service';
import { ClassificaService } from '../services/classifica.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit, OnDestroy {
  players: Player[] = [];
  isAdmin = false;

  newPlayerName = '';
  selectedPlayerToAddPointsId: number | null = null;
  pointsToAdd = 0;
  selectedPlayerToRemovePointsId: number | null = null;
  pointsToRemove = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private classificaService: ClassificaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Aggiorna admin in tempo reale
    this.subscriptions.add(
      this.authService.adminStatus$.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      })
    );

    // Aggiorna giocatori
    this.subscriptions.add(
      this.classificaService.getPlayersObservable().subscribe((players) => {
        this.players = players;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Funzioni Admin
  addPlayer() {
    if (this.newPlayerName.trim()) {
      this.classificaService.addPlayer(this.newPlayerName);
      this.newPlayerName = '';
      alert('✅ Giocatore aggiunto!');
    } else {
      alert('⚠️ Inserisci un nome valido!');
    }
  }

  removePlayer(id: number) {
    const player = this.players.find((p) => p.id === id);
    if (player && confirm(`Sei sicuro di voler eliminare ${player.name}?`)) {
      this.classificaService.removePlayer(id);
      alert('✅ Giocatore eliminato!');
    }
  }

  addPoints() {
    if (this.selectedPlayerToAddPointsId === null)
      return alert('⚠️ Seleziona un giocatore!');

    if (!this.pointsToAdd || this.pointsToAdd <= 0)
      return alert('⚠️ Inserisci un numero di punti valido!');

    this.classificaService.addPoints(this.selectedPlayerToAddPointsId, this.pointsToAdd);
    const player = this.players.find((p) => p.id === this.selectedPlayerToAddPointsId);
    alert(`✅ Aggiunti ${this.pointsToAdd} punti a ${player?.name}!`);

    this.pointsToAdd = 0;
    this.selectedPlayerToAddPointsId = null;
  }

  removePoints() {
    if (this.selectedPlayerToRemovePointsId === null)
      return alert('⚠️ Seleziona un giocatore!');

    if (!this.pointsToRemove || this.pointsToRemove <= 0)
      return alert('⚠️ Inserisci un numero di punti valido!');

    this.classificaService.removePoints(this.selectedPlayerToRemovePointsId, this.pointsToRemove);
    const player = this.players.find((p) => p.id === this.selectedPlayerToRemovePointsId);
    alert(`✅ Rimossi ${this.pointsToRemove} punti a ${player?.name}!`);

    this.pointsToRemove = 0;
    this.selectedPlayerToRemovePointsId = null;
  }

  logout() {
    this.authService.logout();
    alert('👋 Logout effettuato');
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
