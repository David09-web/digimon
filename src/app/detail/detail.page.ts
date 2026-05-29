import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton,
  IonSpinner, IonBadge, IonChip, IonLabel, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid,
  IonList, IonItem, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flashOutline, shieldHalfOutline, starOutline, hardwareChipOutline } from 'ionicons/icons';
import { DigimonService } from '../services/digimon.service';
import { DigimonDetail } from '../interfaces/digimon.interface';
import { DigitalIdPipe } from '../pipes/digital-id.pipe';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton,
    IonSpinner, IonBadge, IonChip, IonLabel, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid,
    IonList, IonItem, IonIcon, DigitalIdPipe
  ]
})
export class DetailPage implements OnInit {
  digimonId!: number;
  digimonName!: string;

  digimon?: DigimonDetail;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private digimonService: DigimonService
  ) {
    addIcons({ flashOutline, shieldHalfOutline, starOutline, hardwareChipOutline });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const nameParam = this.route.snapshot.paramMap.get('name');
    
    if (idParam) {
      this.digimonId = parseInt(idParam, 10);
    }
    if (nameParam) {
      this.digimonName = nameParam;
    }
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

  getLevelColor(level: string): string {
    const l = level.toLowerCase();
    if (l.includes('mega')) return 'warning'; // Gold
    if (l.includes('ultimate')) return 'danger'; // Orange/Red
    if (l.includes('champion')) return 'secondary'; // Purple
    if (l.includes('rookie')) return 'primary'; // Cyan
    return 'medium'; // Grey
  }

  translateLevel(level: string): string {
    const map: { [key: string]: string } = {
      'fresh': 'Bebé I',
      'in-training': 'Bebé II',
      'rookie': 'Novato',
      'champion': 'Campeón',
      'ultimate': 'Ultra',
      'mega': 'Mega',
      'armor': 'Armadura'
    };
    return map[level.toLowerCase()] || level;
  }

  getAttributeColor(attr: string): string {
    const a = attr.toLowerCase();
    if (a.includes('vaccine')) return 'success';
    if (a.includes('virus')) return 'danger';
    if (a.includes('data')) return 'primary';
    return 'medium';
  }

  translateAttribute(attr: string): string {
    const map: { [key: string]: string } = {
      'vaccine': 'Vacuna',
      'virus': 'Virus',
      'data': 'Datos',
      'free': 'Libre',
      'variable': 'Variable',
      'unknown': 'Desconocido'
    };
    return map[attr.toLowerCase()] || attr;
  }

  getCleanDescription(descriptions: any[]): string {
    if (!descriptions || descriptions.length === 0) return 'No hay descripción disponible para este Digimon en el Mundo Digital.';
    const esDesc = descriptions.find(d => d.language === 'es');
    if (esDesc) return esDesc.description;
    const engDesc = descriptions.find(d => d.language === 'en');
    return engDesc ? engDesc.description : descriptions[0].description;
  }
}
