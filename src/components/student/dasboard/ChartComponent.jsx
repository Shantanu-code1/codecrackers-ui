import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from 'recharts'

const ChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0070F3" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0070F3" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          stroke="#A1A1AA" 
          tick={{ fontSize: 10 }}
          interval={0}
        />
        <YAxis 
          stroke="#A1A1AA" 
          label={{ value: 'XP Earned', angle: -90, position: 'insideLeft', stroke: '#A1A1AA' }} 
          allowDecimals={false}
        />
        <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#E5E7EB', borderRadius: '8px' }} formatter={(value) => [`${value} XP`, 'Earned']} />
        <Area type="monotone" dataKey="xp" name="XP" stroke="#0070F3" fillOpacity={1} fill="url(#colorXp)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ChartComponent 