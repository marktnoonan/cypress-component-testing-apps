import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'happy-app-button',
  templateUrl: './happy-button.component.html',
  styleUrls: ['./happy-button.component.scss']
})
export class ButtonComponent {
  @Input() text = '';
  @Output() onClick = new EventEmitter()
}
