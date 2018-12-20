import { TestBed } from '@angular/core/testing';

import { TeoremaService } from './teorema.service';

describe('TeoremaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeoremaService = TestBed.get(TeoremaService);
    expect(service).toBeTruthy();
  });
});
