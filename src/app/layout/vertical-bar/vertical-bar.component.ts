import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vertical-bar',
  templateUrl: './vertical-bar.component.html',
  styleUrls: ['./vertical-bar.component.scss']
})
export class VerticalBarComponent implements OnInit {

  @Output() moved: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }
}
