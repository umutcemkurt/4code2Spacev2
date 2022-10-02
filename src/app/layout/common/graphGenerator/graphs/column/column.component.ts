import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { intelligences, problemSolvingSkills } from 'app/core/Utils/datas';
import { months } from 'moment';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'column-graph',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent implements OnInit , OnChanges {

  @Input("data") data:any[] 
  @Input("param")param = {type: 1 , percent : false , yMax: 0}

  chartOptions:ApexOptions = {}


  constructor(
    private _router:Router,
    private _changeDetectorRef: ChangeDetectorRef,

  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.initGraph()
    
  }

  ngOnInit() {

   // cons   this.initGraph()ole.log(this.data)
    window['Apex'] = {
      chart: {
          events: {
              mounted: (chart: any, options?: any): void => {
                this._fixSvgFill(chart.el);
              },
              updated: (chart: any, options?: any): void => {
                this._fixSvgFill(chart.el);
              }
          }
      }
  };
  }



  initGraph(){
//    debugger
    if (!this.param.yMax) {
      this.param.yMax = 0
    }

    let categories 
    let that = this

    switch (this.param.type) {
      case 1:
        categories = intelligences.map(t => t.name)
        break;
      case 2 :
        categories = problemSolvingSkills.map(t => t.name)
        break;
        case 3: 
        categories = months()

      default:
        break;
    }

    

    this.chartOptions = {
      series: this.data,
      chart: {
        height: 350,
        type: "bar",
        toolbar   : {
          show: false
      },

      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + ( that.param.percent ? "%" : "") ;
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },
      tooltip:{
        theme: "dark",
        
      },
      
      xaxis: {
        categories: categories,
        position: "bottom",
        labels: {
          offsetY: 0
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
   
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.10,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        max: (max: number): number => this.param.yMax == 0 ? max : this.param.yMax,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + ( that.param.percent ? "%" : "") ;
          }
        }
      }
     
    }
  }

  private _fixSvgFill(element: Element): void
  {
      // Current URL
      const currentURL = this._router.url;

      // 1. Find all elements with 'fill' attribute within the element
      // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
      // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
      Array.from(element.querySelectorAll('*[fill]'))
           .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
           .forEach((el) => {
               const attrVal = el.getAttribute('fill');
               el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
           });
  }

}
