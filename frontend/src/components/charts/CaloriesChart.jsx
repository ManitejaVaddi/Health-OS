import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CaloriesChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis dataKey="name" stroke="#64748B" />
      <YAxis stroke="#64748B" />
      <Tooltip />
      <Bar dataKey="calories" fill="#06B6D4" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default CaloriesChart;
