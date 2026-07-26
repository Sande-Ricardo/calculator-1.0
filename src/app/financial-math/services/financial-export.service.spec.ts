import { TestBed } from '@angular/core/testing';

import { FinancialExportService } from './financial-export.service';

describe('FinancialExportService', () => {
  let service: FinancialExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
