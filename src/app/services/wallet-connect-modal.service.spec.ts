import { TestBed } from '@angular/core/testing';

import { WalletConnectModalService } from './wallet-connect-modal.service';

describe('WalletConnectModalService', () => {
  let service: WalletConnectModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletConnectModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
