import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccn-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss'],
})
export class InfoMessageComponent {
  @Input() message!: string;
}
