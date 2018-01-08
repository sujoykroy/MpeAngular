import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSliderModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSliderModule,
            MatTabsModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSliderModule,
            MatTabsModule],
})

export class MaterialModule { }
