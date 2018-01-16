import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SceneService } from '../../misc/scene.service';
import { MatDialog } from '@angular/material';
import { TimeMarkerEditorComponent } from '../time-marker-editor/time-marker-editor.component';

@Component({
    selector: 'master-time-line',
    templateUrl: './master-time-line.component.html',
    styleUrls: ['./master-time-line.component.css']
})
export class MasterTimeLineComponent implements OnInit {
    @ViewChild('timeLineWrapper')
    _timeLineWrapper:ElementRef;

    _timeLineDimension: ClientRect | null = null;

    constructor(public sceneService: SceneService,
                public dialog: MatDialog) {
    }

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
    }

    onTimeMarkerSlide(timeMarkerIdNum, $event) {
        let timeMarker = this.sceneService.activeTimeLine.getTimeMarkerByIdNum(timeMarkerIdNum);
        if(!timeMarker) return;
        this._timeLineDimension = this._getTimeLineDimensions();
        let percent = $event.center.x/this._timeLineDimension.width;
        let t = this.sceneService.activeScene.duration*percent;
        this.sceneService.activeTimeLine.moveTimeMarkerTo(t, timeMarker);
    }

    onTimeMarkerClick(timeMarkerIdNum) {
        let timeMarker = this.sceneService.activeTimeLine.getTimeMarkerByIdNum(timeMarkerIdNum);
        if(!timeMarker) return;
        this.sceneService.moveToTime(timeMarker.getAt());
    }

    onTimeMarkerDblClick(timeMarkerIdNum) {
        let timeMarker = this.sceneService.activeTimeLine.getTimeMarkerByIdNum(timeMarkerIdNum);
        if(!timeMarker) return;
        let dialogRef = this.dialog.open(TimeMarkerEditorComponent, {
            data: { timeMarker: timeMarker}
        });
    }
}
