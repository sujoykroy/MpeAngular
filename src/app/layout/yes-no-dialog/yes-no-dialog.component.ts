import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'yes-no-dialog',
    templateUrl: './yes-no-dialog.component.html'
})
export class YesNoDialogComponent implements OnInit {
    @Input() title:string;
    @Input() desc:string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = this.data.title;
        this.desc = this.data.desc;
    }

    ngOnInit() {}
}
