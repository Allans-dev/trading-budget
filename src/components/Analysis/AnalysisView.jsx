import { left } from "inquirer/lib/utils/readline";
import React from "react";

import { VictoryPie } from "victory";

import "./analysis_styles.css";

const AnalysisView = (props) => {
  const { stocksOuter, stocksInner, budgetInner, budgetOuter } = props;

  return (
    <div class="analysis-view">
      <svg width={380} height={380}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={stocksOuter}
          labelRadius={({ innerRadius }) => innerRadius + 25}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={stocksInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
        />
      </svg>
      <svg width={380} height={380}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={budgetOuter}
          labelRadius={({ innerRadius }) => innerRadius + 25}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          data={budgetInner}
          labelRadius={({ innerRadius }) => innerRadius + 25}
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
