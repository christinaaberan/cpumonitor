import React, { PureComponent } from 'react';
import {
  Label,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';

const initialData = [];
const getAxisYDomain = (from, to, ref, offset) => {
  const refData = initialData.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [(bottom | 0) - offset, (top | 0) + offset];
};

const initialState = {
  data: initialData,
  left: 'dataMin',
  right: 'dataMax',
  refAreaLeft: '',
  refAreaRight: '',
  top: 'dataMax+1',
  bottom: 'dataMin-1',
  top2: 'dataMax+20',
  bottom2: 'dataMin-20',
  animation: true,
};

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/highlight-zomm-line-chart-v77bt';

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  
  toPercent(num) {
    return Math.round(num * 100);
  }
  render() {
    const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.state;
    console.log(this.props.graphData)
    return (
      <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
        <p style={{textAlign: 'center'}}>CPU Usage over Past 10 Minutes (%)</p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={800}
            height={400}
            data={this.props.graphData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" domain={[0, right]} tick={{fontSize: 14 }} minTickGap={50} stroke="white" />
            <YAxis allowDataOverflow={true} domain={[0, 150]} type="number" yAxisId="1" stroke="white" />
            <YAxis orientation="right" allowDataOverflow domain={[bottom2, top2]} type="number" yAxisId="2" />
            <Tooltip />
            <Line yAxisId="1" type="natural" dataKey="usage" stroke="#8884d8" animationDuration={300} />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}