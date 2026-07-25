import { Component, Output, EventEmitter } from '@angular/core';
import { ConverterDataService } from '../../services/converter-data.service';
import { PhysicalConstant } from '../../models/converter.model';

@Component({
  selector: 'app-physical-constants',
  templateUrl: './physical-constants.component.html',
  styleUrls: ['./physical-constants.component.scss']
})
export class PhysicalConstantsComponent {
  @Output() injectConstant = new EventEmitter<number>();

  constants: PhysicalConstant[] = [];

  constructor(private dataService: ConverterDataService) {
    this.constants = this.dataService.PHYSICAL_CONSTANTS;
  }

  onInject(val: number): void {
    this.injectConstant.emit(val);
  }
}
