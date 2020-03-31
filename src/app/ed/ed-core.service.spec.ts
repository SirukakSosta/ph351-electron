import { TestBed } from '@angular/core/testing';

import { EdCoreService } from './ed-core.service';

describe('EdCoreService', () => {
  let service: EdCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
