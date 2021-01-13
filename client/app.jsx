import React from 'react';
import Chart from 'chart.js';
import axios from 'axios';
import moment from 'moment';
import MyChart from './MyChart.jsx';

import './style.scss';

const COINDESK_URL = 'https://api.coindesk.com/v1/bpi/historical/close.json';
const DATE_FORMAT = 'YYYY-MM-DD';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'line',
      unit: 'day',
      data: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData(unit = 'day') {
    let end = moment().subtract(1, 'd');
    let start;

    switch (unit) {
      case 'month':
        start = end.clone().subtract(600, 'd');
        break;
      case 'year':
        start = moment('2010-07-17', DATE_FORMAT);
        break;
      default:
        start = end.clone().subtract(31, 'd');
    }

    axios
      .get(
        `${COINDESK_URL}?start=${start.format(DATE_FORMAT)}&end=${end.format(
          DATE_FORMAT
        )}`
      )
      .then((response) => {
        this.setState({ data: response.data.bpi });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange(e) {
    let { id, value } = e.target;

    this.setState({ [id]: value });

    if (id === 'unit') {
      this.getData(value);
    }
  }

  render() {
    let { type, unit, data } = this.state;

    return (
      <>
        <MyChart type={type} unit={unit} data={data} />
        <div className='container is-flex is-justify-content-center is-align-items-center'>
          <span className='p-1'>Chart Type</span>
          <div className='p-1'>
            <select
              id='type'
              className='select'
              value={type}
              onChange={this.handleChange}
            >
              <option value='line'>Line</option>
              <option value='bar'>Bar</option>
            </select>
          </div>
          <div className='p-1'>
            <select
              id='unit'
              className='select'
              value={unit}
              onChange={this.handleChange}
            >
              <option value='day'>Day</option>
              <option value='month'>Month</option>
              <option value='year'>Year</option>
            </select>
          </div>
        </div>
      </>
    );
  }
}

export default App;
