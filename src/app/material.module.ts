import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSliderModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSliderModule,
            MatTabsModule, MatDialogModule, MatInputModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSliderModule,
            MatTabsModule, MatDialogModule, MatInputModule],
})

export class MaterialModule { }
