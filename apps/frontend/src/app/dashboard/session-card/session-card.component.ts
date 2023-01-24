import { Component } from '@angular/core';

enum risks {
  LOW = 'niedrig',
  MEDIUM = 'mittel',
  HIGH = 'hoch',
  INFECTED = 'infiziert',
}

@Component({
  selector: 'ccn-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent {}
