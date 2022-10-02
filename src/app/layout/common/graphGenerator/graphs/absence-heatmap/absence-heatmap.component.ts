import { Component, Input, OnInit } from '@angular/core';
import moment, { weekdays, weekdaysMin, weekdaysShort } from 'moment';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'absence-heatmap',
  templateUrl: './absence-heatmap.component.html',
  styleUrls: ['./absence-heatmap.component.scss']
})
export class AbsenceHeatmapComponent implements OnInit {


  @Input("data")data

  heatMap:ApexOptions = {}
  constructor() { }

  ngOnInit() {
  //  console.log(weekdaysMin(true))
  //  console.log(moment("2022-02-06T12:00Z").weekday())
    this.initGrahp()
  }

  initGrahp(){
    this.heatMap = {
      series: [
        {
          name: "Metric1",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric2",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric3",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric4",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric5",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric6",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric7",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric8",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric9",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric10",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric11",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric12",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric13",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric14",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric15",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric16",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric17",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric18",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Metric19",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        
      ],
      chart: {
        height: "100%",
        type: "heatmap",
        toolbar:{
          show:false
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: "HeatMap Chart (Single color)"
      },
      yaxis: {
        show:false,
        opposite: true
      }
    };
  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    let today = moment().weekday()
    let weeks =weekdaysMin(true)
    while (i < count) {
      var x = weeks[(today + i) % 6]
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
   

}
