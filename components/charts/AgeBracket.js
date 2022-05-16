import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Text } from "@mantine/core";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <Text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </Text>
  );
};
export default function AgeBracket() {

  const [data, setData] = useState([]);
   useEffect(() => {
    fetch("api/analytics/getAgeBracket")
        .then(res => res.json())
        .then(data => {
            setData(data);
        }
        );
    }, []);
    console.log(data);
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
    
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} iconType="wye"/>
    </PieChart>
  );
}
