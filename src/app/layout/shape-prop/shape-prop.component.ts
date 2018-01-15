import { Component, OnInit, Input } from '@angular/core';
import { SceneService }  from '../../misc/scene.service';
import { ShapeProp, FloatShapeProp } from '../../shapes/shape-props';

@Component({
  selector: 'shape-prop',
  templateUrl: './shape-prop.component.html',
  styleUrls: ['./shape-prop.component.css']
})
export class ShapePropComponent implements OnInit {
    @Input() shapeProp:ShapeProp;

    set value(v){
        let rawValue = this.shapeProp.parseValue(v);
        if (this.sceneService.activeShape) {
            this.sceneService.setActiveShapePropValue(this.shapeProp.propName, rawValue);
        }
    }

    get value() {
        let rawValue = this.sceneService.getActiveShapePropValue(this.shapeProp.propName);
        return this.shapeProp.getFormattedValue(rawValue);
    }

    constructor(public sceneService: SceneService) {}
    ngOnInit() {}
}
