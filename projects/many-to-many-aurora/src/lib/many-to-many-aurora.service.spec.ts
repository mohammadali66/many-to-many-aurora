import { TestBed } from '@angular/core/testing';

import { ManyToManyAuroraService } from './many-to-many-aurora.service';

describe('ManyToManyAuroraService', () => {
  let service: ManyToManyAuroraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManyToManyAuroraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
