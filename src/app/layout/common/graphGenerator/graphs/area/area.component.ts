import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import moment, { months } from 'moment';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'area-graph',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AreaComponent implements OnInit {

@Input("data") data

  chartVisitors:ApexOptions = {}

  constructor(
    private _router: Router

  ) { }

  ngOnInit() {

let arr = []


//    let b = monthsArr.findIndex( t=> t == a)
for (let index = moment().month(); index >= 0 ; index--) {
    
    arr.push(months()[index])

    if (index == 0) {
        for (let k = 11; k > moment().month(); k--) {
            arr.push(months()[k])
            
        }
    }
    
}
    let data = cloneDeep(this.data)

    if(this.data[0].data.length !=  arr.length){
     //   debugger
        let dataCount = data[0].data.length
        let arrCount = arr.length
        let dataArr = []
        for(let i = 0;i < ( arrCount - dataCount)  ;i++){
            dataArr.push(0)
        } 
        console.log(this.data)
        data[0].data = [
            ...dataArr,
            ...data[0].data
        
        ]
    }
  
      this.initGraph(arr.reverse() , data)
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

  initGraph(motnhs , data){
      console.log(motnhs)
    this.chartVisitors = {
      chart     : {
          animations: {
              speed           : 400,
              animateGradually: {
                  enabled: false
              }
          },
          fontFamily: 'inherit',
          foreColor : 'inherit',
          width     : '100%',
          height    : '100%',
          type      : 'area',
          toolbar   : {
              show: false
          },
          zoom      : {
              enabled: false
          }
      },
      colors    : ['#818CF8'],
      dataLabels: {
          enabled: true
      },
      fill      : {
          colors: ['#312E81']
      },
      grid      : {
          show       : true,
          borderColor: '#334155',
          padding    : {
              top   : 0,
              bottom: 0,
              left  : 20,
              right : 10
          },
          position   : 'back',
          xaxis      : {
              lines: {
                  show: true
              }
          }
      },
      series    : data,
      stroke    : {
          width: 2
      },
      tooltip   : {
          followCursor: true,
          theme       : 'dark',
          x           : {
            formatter: (value: number): string => `${value}`

          },
          y           : {
              formatter: (value: number): string => `${value}`
          }
      },
      xaxis     : {
          axisBorder: {
              show: false
          },
          axisTicks : {
              show: false
          },
          crosshairs: {
              stroke: {
                  color    : '#475569',
                  dashArray: 0,
                  width    : 2
              }
          },
          labels    : {
              
              style  : {
                  colors: '#CBD5E1'
              }
          },
         
          tooltip   : {
              enabled: false
          },
          type      : 'category',
          categories: motnhs
          
      },
      yaxis     : {
          axisTicks : {
              show: false
          },
          axisBorder: {
              show: false
          },
          min       : (min): number => min - 0,
          max       : (max): number => max + 0,
     
          show      : false
      }
  };

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
