import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
@Component({
  selector: 'app-mixed-download-app',
  templateUrl: './mixed-download-app.component.html',
})
export class MixedDownloadAppComponent implements OnInit {
  @Input() btnColor: string = '';
  @Input() chartHeight: string;
  @Input() download_link: string;
  @Input() icon_link: string;
  @Input() title: string;
  chartOptions: any = {};

  size_qr: any = 320
  size_icon: any = 70

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = getChartOptions(this.chartHeight, this.btnColor);
  }

  download(url: any) {
    window.open(url, "_blank")
  }
}

function getChartOptions(chartHeight: string, chartColor: string) {
  const baseColor = getCSSVariableValue('--kt-' + chartColor);
  const lightColor = getCSSVariableValue('--kt-' + chartColor + '-light');
  const labelColor = getCSSVariableValue('--kt-gray-700');

  return {
    series: [74],
    chart: {
      fontFamily: 'inherit',
      height: chartHeight,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
        },
        dataLabels: {
          name: {
            show: false,
            fontWeight: '700',
          },
          value: {
            color: labelColor,
            fontSize: '30px',
            fontWeight: '700',
            offsetY: 12,
            show: true,
            formatter: function (val: number) {
              return val + '%';
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: '100%',
        },
      },
    },
    colors: [baseColor],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };
}
