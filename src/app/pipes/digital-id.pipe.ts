import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitalId',
  standalone: true
})
export class DigitalIdPipe implements PipeTransform {
  /**
   * Transforma un número ID en un formato digital cyberpunk con ceros a la izquierda y prefijo.
   * Ejemplo: 1 -> DX-0001
   * @param value ID del Digimon
   */
  transform(value: number | string): string {
    if (value === undefined || value === null) return '';
    const numStr = value.toString();
    const padded = numStr.padStart(4, '0');
    return `DX-${padded}`;
  }
}
