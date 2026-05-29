import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
  IonSpinner, IonBadge, IonChip, IonLabel, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid,
  IonList, IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, flashOutline, shieldHalfOutline, starOutline, hardwareChipOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { DigimonService } from '../../services/digimon.service';
import { DigimonDetail } from '../../interfaces/digimon.interface';
import { DigitalIdPipe } from '../../pipes/digital-id.pipe';

@Component({
  selector: 'app-digimon-detail',
  templateUrl: './digimon-detail.component.html',
  styleUrls: ['./digimon-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonIcon, IonSpinner, IonBadge, IonChip, IonLabel, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid,
    IonList, IonItem, DigitalIdPipe
  ]
})
export class DigimonDetailComponent implements OnInit {
  @Input() digimonId!: number;
  @Input() digimonName!: string;

  digimon?: DigimonDetail;
  loading = true;
  error = false;

  constructor(
    private modalCtrl: ModalController,
    private digimonService: DigimonService
  ) {
    addIcons({ closeOutline, flashOutline, shieldHalfOutline, starOutline, hardwareChipOutline });
  }

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail() {
    this.loading = true;
    this.error = false;
    this.digimonService.getDigimonDetail(this.digimonId || this.digimonName).subscribe({
      next: (data) => {
        this.digimon = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading digimon detail:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getLevelColor(level: string): string {
    const l = level.toLowerCase();
    if (l.includes('mega')) return 'warning'; // Gold
    if (l.includes('ultimate')) return 'danger'; // Orange/Red
    if (l.includes('champion')) return 'secondary'; // Purple
    if (l.includes('rookie')) return 'primary'; // Cyan
    return 'medium'; // Grey
  }

  getAttributeColor(attr: string): string {
    const a = attr.toLowerCase();
    if (a.includes('vaccine')) return 'success';
    if (a.includes('virus')) return 'danger';
    if (a.includes('data')) return 'primary';
    return 'medium';
  }

  getCleanDescription(descriptions: any[]): string {
    if (!descriptions || descriptions.length === 0) return 'No hay descripción disponible para este Digimon en el Mundo Digital.';
    const engDesc = descriptions.find(d => d.language === 'en');
    return engDesc ? engDesc.description : descriptions[0].description;
  }
}
