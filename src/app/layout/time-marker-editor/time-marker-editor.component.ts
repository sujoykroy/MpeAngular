import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { SceneService } from '../../misc/scene.service';
import { YesNoDialogComponent } from './../yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'time-marker-editor',
  templateUrl: './time-marker-editor.component.html',
  styleUrls: ['./time-marker-editor.component.css']
})
export class TimeMarkerEditorComponent implements OnInit {
    text:string

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private sceneService:SceneService,
                public dialogRef: MatDialogRef<TimeMarkerEditorComponent>,
                private dialog:MatDialog) {
        this.text = this.data.timeMarker.getText();
    }

    onSave() {
        this.data.timeMarker.setText(this.text);
        this.dialogRef.close("Saved");
    }

    onDelete() {
        let yesNodialogRef = this.dialog.open(
            YesNoDialogComponent, {
                data: {
                    title: "Deletion Warning!",
                    desc: "Do you really want to delete this marker?"
                }
            }
        );
        yesNodialogRef.afterClosed().subscribe(result => {
            if(result) {
                if (this.sceneService.activeTimeLine.deleteTimeMarker(this.data.timeMarker)) {
                    this.dialogRef.close("Deleted");
                }
            }
        });
    }

    ngOnInit() {}
}
