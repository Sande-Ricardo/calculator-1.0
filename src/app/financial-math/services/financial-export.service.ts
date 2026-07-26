import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinancialExportService {

  constructor() { }

  /**
   * Genera y descarga un archivo CSV a partir de un arreglo de objetos.
   * @param data Arreglo de objetos (ej. tabla de amortización)
   * @param filename Nombre del archivo a descargar (sin extensión .csv)
   */
  exportToCsv(data: any[], filename: string): void {
    if (!data || !data.length) {
      return;
    }

    const separator = ',';
    const keys = Object.keys(data[0]);
    
    // Generar cabeceras
    const headerRow = keys.join(separator);
    
    // Generar filas
    const rows = data.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        
        // Encerrar en comillas si contiene separador, nueva línea o comillas
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    });

    const csvString = [headerRow, ...rows].join('\r\n');
    this.downloadFile(csvString, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob(['\uFEFF' + content], { type: mimeType }); // \uFEFF es el BOM para UTF-8 (ayuda a Excel a leer tildes/caracteres especiales)
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpiar memoria
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}
