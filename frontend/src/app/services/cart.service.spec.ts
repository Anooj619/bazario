import { TestBed } from '@angular/core/testing';

import { CartServiceTs } from './cart.service.ts';

describe('CartServiceTs', () => {
  let service: CartServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
