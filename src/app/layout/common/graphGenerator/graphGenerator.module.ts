import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphGeneratorComponent } from './graphGenerator.component';
import { RadarComponent } from './graphs/radar/radar.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AreaComponent } from './graphs/area/area.component';
import { ColumnComponent } from './graphs/column/column.component';
import { AbsenceHeatmapComponent } from './graphs/absence-heatmap/absence-heatmap.component';

@NgModule({
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  declarations: [
    GraphGeneratorComponent,
    RadarComponent,
    AreaComponent,
    ColumnComponent,
    AbsenceHeatmapComponent
  ],
  exports:[
    GraphGeneratorComponent
  ]
})
export class GraphGeneratorModule { }
