import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeScannerComponent } from './qr-code-scanner.component';

describe('QrCodeScannerComponent', () => {
  let component: QrCodeScannerComponent;
  let fixture: ComponentFixture<QrCodeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrCodeScannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
