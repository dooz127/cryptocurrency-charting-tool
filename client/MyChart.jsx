import React from 'react';
import moment from 'moment';

class MyChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
l    let { type, data } = this.props;
    let canvasRef = this.canvasRef;

    this.chart = new Chart(canvasRef.current, {
      type: type,
      data: {
        labels: [],
        datasets: [
          {
            label: 'BTC - Bitcoin',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderColor: 'rgb(255, 160, 64)',
            borderWidth: 2,
            data: [],
            fill: false,
            lineTension: 0,
            pointRadius: 0,
            type: type
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              distribution: 'series',
              offset: true,
              ticks: {
                major: {
                  enabled: true,
                  fontStyle: 'bold'
                },
                source: 'auto',
                autoSkip: true,
                autoSkipPadding: 75,
                maxRotation: 0,
                sampleSize: 100
              },
              afterBuildTicks: function(scale, ticks) {
                if (ticks) {
                  var majorUnit = scale._majorUnit;
                  var firstTick = ticks[0];
                  var i, ilen, val, tick, currMajor, lastMajor;

                  val = moment(ticks[0].value);
                  if (
                    (majorUnit === 'day' && val.hour() === 9) ||
                    (majorUnit === 'month' &&
                      val.date() <= 3 &&
                      val.isoWeekday() === 1) ||
                    (majorUnit === 'year' && val.month() === 0)
                  ) {
                    firstTick.major = true;
                  } else {
                    firstTick.major = false;
                  }
                  lastMajor = val.get(majorUnit);

                  for (i = 1, ilen = ticks.length; i < ilen; i++) {
                    tick = ticks[i];
                    val = moment(tick.value);
                    currMajor = val.get(majorUnit);
                    tick.major = currMajor !== lastMajor;
                    lastMajor = currMajor;
                  }
                  return ticks;
                }
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                drawBorder: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Closing price ($)'
              }
            }
          ]
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          callbacks: {
            label: function(tooltipItem, myData) {
              var label = myData.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += parseFloat(tooltipItem.value).toFixed(2);
              return label;
            }
          }
        }
      }
    });
  }

  componentDidUpdate() {
    let { type, data } = this.props;

    let chart = this.chart;

    chart.data.labels = Object.keys(data);
    chart.data.datasets[0].data = Object.values(data);
    chart.data.datasets[0].type = type;
    chart.update();
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default MyChart;
