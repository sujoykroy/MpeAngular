import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'tool-button',
  templateUrl: './tool-button.component.html',
  styleUrls: ['./tool-button.component.css']
})
export class ToolButtonComponent implements OnInit {
  @Input() tool;

  ngOnInit() {}

  @HostListener("click", ["$event"])
  onClick() {
    this.tool.action();
  }
}
