import { Component } from '@angular/core';
import { ConverterDataService } from '../../services/converter-data.service';

@Component({
  selector: 'app-si-prefixes',
  templateUrl: './si-prefixes.component.html',
  styleUrls: ['./si-prefixes.component.scss']
})
export class SiPrefixesComponent {
  prefixes = this.dataService.SI_PREFIXES;

  constructor(private dataService: ConverterDataService) {}
}
