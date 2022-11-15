import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';

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
export class SessionCardComponent {
  lastUpdate = '01.11.2022 16:35:40';
  infectionRisk = risks.MEDIUM;
}
