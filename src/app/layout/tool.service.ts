import { Injectable } from '@angular/core';

class Tool {
  text:String;
  action: Function;

  constructor(text: string, action) {
    this.text = text;
    this.action = action;
  }
}

@Injectable()
export class ToolService {
    tools = {}

    addNewTool(category, text, action) {
        let tool = new Tool(text, action);
        if (!this.tools.hasOwnProperty(category)) {
            this.tools[category] = [];
        }
        this.tools[category].push(tool);
    }
}
