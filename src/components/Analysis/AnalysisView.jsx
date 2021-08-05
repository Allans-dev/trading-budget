import React from "react";

import { VictoryPie } from "victory";

import "./analysis_styles.css";

const AnalysisView = (props) => {
  const { stocksOuter, stocksInner, budgetInner, budgetOuter } = props;

  console.log(stocksOuter);

  console.log(stocksInner);

  const colors = [
    "cornflowerblue",
    "gold",
    "orange",
    "turquoise",
    "tomato",
    "greenyellow",
  ];

  const theme = {
    pie: {
      style: {
        data: {
          padding: 10,
          stroke: "transparent",
          strokeWidth: 1,
        },
        // labels: assign({}, baseLabelStyles, { padding: 20 }),
      },
      colorScale: colors,
      width: 400,
      height: 400,
      padding: 50,
    },
  };

  return (
    <div class="analysis-view">
      <svg width={380} height={380}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={stocksOuter}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={colors}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={stocksInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={colors}
          style={{
            data: {
              fill: ({ datum }) => (datum.x === "profit" ? "green" : "red"),
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
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={budgetInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={colors}

          //   style={{
          //     data: {
          //       fillOpacity: 0.9,
          //       stroke: "#c43a31",
          //       strokeWidth: 3,
          //     },
          //     labels: {
          //       fontSize: 25,
          //       fill: "#c43a31",
          //     },
          //   }}
        />
      </svg>
    </div>
  );
};

export default AnalysisView;
