import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SceneService } from '../../misc/scene.service';

@Component({
    selector: 'master-time-line',
    templateUrl: './master-time-line.component.html',
    styleUrls: ['./master-time-line.component.css']
})
export class MasterTimeLineComponent implements OnInit {
    @ViewChild('timeLineWrapper')
    _timeLineWrapper:ElementRef;

    _timeLineDimension: ClientRect | null = null;

    constructor(public sceneService: SceneService) { }

    ngOnInit() {}

    getMarkerLeft(timeMarker) {
        if (!this._timeLineDimension) return "";
        let percent:number = timeMarker.getAt()/this.sceneService.activeScene.duration;
        return (this._timeLineDimension.width*percent).toFixed(2);
    }

    private _getTimeLineDimensions() {
        if (this._timeLineWrapper) {
             return this._timeLineWrapper.nativeElement.getBoundingClientRect();
        }
        return null;
    }

    ngAfterViewInit() {
        this._timeLineDimension = this._getTimeLineDimensions();
        console.log(this._timeLineDimension);
    }

}
