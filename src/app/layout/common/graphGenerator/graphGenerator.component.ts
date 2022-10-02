import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ChartComponent } from 'ng-apexcharts';



@Component({
  selector: 'graph-builder',
  templateUrl: './graphGenerator.component.html',
  styleUrls: ['./graphGenerator.component.scss']
})
export class GraphGeneratorComponent implements OnInit {

  @Input("type") type:number 
  @Input("param") paramaters? 
  @Input("data") data
  


  constructor() { }


  ngOnInit() {
  }

}
