import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const WeightChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis dataKey="date" stroke="#64748B" />
      <YAxis stroke="#64748B" />
      <Tooltip />
      <Line type="monotone" dataKey="weight" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default WeightChart;
