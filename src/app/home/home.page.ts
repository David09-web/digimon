import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
  IonCard, IonCardContent, IonSearchbar, IonSkeletonText, IonInfiniteScroll, 
  IonInfiniteScrollContent, IonButton, IonIcon, IonText, IonSpinner, 
  ModalController, IonRefresher, IonRefresherContent, IonList, IonItem, IonThumbnail, IonLabel
} from '@ionic/angular/standalone';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { searchOutline, refreshOutline, hardwareChipOutline } from 'ionicons/icons';

import { DigimonService } from '../services/digimon.service';
import { Digimon, DigimonResponse } from '../interfaces/digimon.interface';
import { DigimonDetailComponent } from '../components/digimon-detail/digimon-detail.component';
import { DigitalIdPipe } from '../pipes/digital-id.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonSearchbar, 
    IonSkeletonText, IonInfiniteScroll, IonInfiniteScrollContent, IonButton, 
    IonIcon, IonText, IonSpinner, IonRefresher, IonRefresherContent, DigitalIdPipe,
    IonList, IonItem, IonThumbnail, IonLabel
  ],
  providers: [ModalController]
})
export class HomePage implements OnInit, OnDestroy {
  digimons: Digimon[] = [];
  currentPage = 0;
  totalPages = 1;
  pageSize = 50;
  
  searchTerm = '';
  loading = true;
  isSearching = false;
  error = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private digimonService: DigimonService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    addIcons({ searchOutline, refreshOutline, hardwareChipOutline });
  }

  ngOnInit() {
    this.loadInitialDigimons();
    
    // Configurar búsqueda con debounce reactivo
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(450),
      distinctUntilChanged()
    ).subscribe(term => {
      this.executeSearch(term);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadInitialDigimons() {
    this.loading = true;
    this.error = false;
    this.currentPage = 0;
    this.digimons = [];
    
    this.digimonService.getDigimons(this.currentPage, this.pageSize).subscribe({
      next: (response: DigimonResponse) => {
        this.digimons = response.content;
        this.totalPages = response.pageable.totalPages;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching digimons:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSearchChange(event: any) {
    const value = event.detail.value || '';
    this.searchTerm = value.trim();
    this.searchSubject.next(this.searchTerm);
  }

  executeSearch(term: string) {
    this.currentPage = 0;
    this.error = false;

    if (!term) {
      this.isSearching = false;
      this.loadInitialDigimons();
      return;
    }

    this.loading = true;
    this.isSearching = true;
    
    this.digimonService.searchDigimons(term, this.currentPage, this.pageSize).subscribe({
      next: (response: DigimonResponse) => {
        // En algunas APIs, si no encuentra nada, puede devolver vacio o error 404. 
        // Digi-API devuelve vacio o responde correctamente
        this.digimons = response.content || [];
        this.totalPages = response.pageable ? response.pageable.totalPages : 1;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Search failed:', err);
        // Si es 404 es que no encontró nada, no es un error de sistema estricto
        if (err.status === 404) {
          this.digimons = [];
          this.totalPages = 0;
        } else {
          this.error = true;
        }
        this.loading = false;
      }
    });
  }

  loadMore(event: any) {
    if (this.currentPage >= this.totalPages - 1) {
      event.target.complete();
      event.target.disabled = true;
      return;
    }

    this.currentPage++;
    
    const request$ = this.isSearching 
      ? this.digimonService.searchDigimons(this.searchTerm, this.currentPage, this.pageSize)
      : this.digimonService.getDigimons(this.currentPage, this.pageSize);

    request$.subscribe({
      next: (response: DigimonResponse) => {
        if (response.content && response.content.length > 0) {
          this.digimons = [...this.digimons, ...response.content];
        }
        event.target.complete();
        
        if (this.currentPage >= this.totalPages - 1) {
          event.target.disabled = true;
        }
      },
      error: (err: any) => {
        console.error('Error loading more digimons:', err);
        event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.currentPage = 0;
    this.error = false;
    
    const request$ = this.isSearching 
      ? this.digimonService.searchDigimons(this.searchTerm, this.currentPage, this.pageSize)
      : this.digimonService.getDigimons(this.currentPage, this.pageSize);

    request$.subscribe({
      next: (response: DigimonResponse) => {
        this.digimons = response.content || [];
        this.totalPages = response.pageable ? response.pageable.totalPages : 1;
        event.target.complete();
        
        // Reactivar el infinite scroll si estaba desactivado
        const infScroll = document.querySelector('ion-infinite-scroll');
        if (infScroll) {
          (infScroll as any).disabled = false;
        }
      },
      error: (err: any) => {
        console.error('Error refreshing:', err);
        event.target.complete();
      }
    });
  }

  openDetail(digimon: Digimon) {
    this.router.navigate(['/detail', digimon.id, digimon.name]);
  }
}
