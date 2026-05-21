import { TestBed } from '@angular/core/testing';

import { Votacion } from './votacion';

describe('Votacion', () => {
  let service: Votacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Votacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
