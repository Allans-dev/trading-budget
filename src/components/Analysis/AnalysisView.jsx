import React from "react";

import { VictoryPie } from "victory";

import "./analysis_styles.css";

const AnalysisView = (props) => {
  const { stocksOuter, stocksInner, budgetInner, budgetOuter } = props;

  console.log(stocksOuter);

  console.log(stocksInner);

  const colors = ["#805B05", "#FFCD57", "#FFB60A", "#80662B", "#CC9108"];

  const profitLossColors = stocksOuter.map((val, index) => {
    if (val.profit) {
      if (index % 2 === 0) {
        return "#8AA31F";
      } else return "#A2B357";
    } else if (index % 2 === 0) {
      return "#F06151";
    } else return "#F2A49B";
  });

  return (
    <div class="analysis-view">
      <svg width={380} height={380}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={stocksOuter}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={profitLossColors}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={stocksInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          style={{
            data: {
              fill: ({ datum }) =>
                datum.x === "profit" ? "#8AA31F" : "#F06151",
            },
          }}
        />
      </svg>
      <svg width={380} height={380}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={budgetOuter}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={colors}
          style={{
            data: {
              stroke: "#c43a31",
              strokeWidth: 1,
            },
          }}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={budgetInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={colors}
          style={{
            data: {
              stroke: "#c43a31",
              strokeWidth: 1,
            },
          }}
        />
      </svg>
    </div>
  );
};

export default AnalysisView;
