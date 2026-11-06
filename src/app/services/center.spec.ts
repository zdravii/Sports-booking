import { TestBed } from '@angular/core/testing';

import { Center } from './center';

describe('Center', () => {
  let service: Center;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Center);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
