import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})


export class HeaderComponent implements OnInit {
  toolCategories = [];
  tools = {};

  constructor(toolService: ToolService) {
    this.toolCategories = Object.keys(toolService.tools);
    this.tools = toolService.tools;
  }

  ngOnInit() {}
}
