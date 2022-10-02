import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { intelligences, problemSolvingSkills } from 'app/core/Utils/datas';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'radar-graph',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadarComponent implements OnInit,OnChanges {

  @Input("params") params:{type:number , yMax:number}
  @Input("data") data


  chartBudgetDistribution: ApexOptions = {};


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,

  ) {

  
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initGraph()
    
  }


  ngOnInit() {

  }


  initGraph() {
    this.chartBudgetDistribution = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        width: '100%', 
        type: 'radar',
        sparkline: {
          enabled: true
        }
      },
      legend:{
        show:true,
        position:"top",
        onItemHover: {
          highlightDataSeries: true
        }
    
      },
      colors: ['#818CF8'],
      dataLabels: {
        enabled: true,
        formatter: (val: number): string | number => `${val}`,
        textAnchor: 'start',
        style: {
          fontSize: '14px',
          fontWeight: 500
        },
        background: {
          borderWidth: 0,
          padding: 4
        },
        offsetY: -15
      },
      markers: {
        strokeColors: '#818CF8',
        strokeWidth: 4
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: 'var(--fuse-border)',
            connectorColors: 'var(--fuse-border)'
          }
        }
      },
      series: this.data,
      stroke: {
        width: 2
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number): string => `${val}`
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            fontWeight: '500'
          }
        },
        categories: this.params.type == 1 ? intelligences.map(t => t.name) : problemSolvingSkills.map(t => t.name)
      },
      yaxis: {
        max: (max: number): number => this.params.yMax == 0 ? parseInt((max + 100).toFixed(0), 10) : max,
        tickAmount: 8
      }
    };
  }

}
