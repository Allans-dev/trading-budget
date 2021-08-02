import { left } from "inquirer/lib/utils/readline";
import React from "react";

import { VictoryPie } from "victory";

import "./analysis_styles.css";

const AnalysisView = () => {
  const sampleData = [
    { x: "Cats", y: 35 },
    { x: "Dogs", y: 40 },
    { x: "Birds", y: 55 },
  ];
  return (
    <div class="analysis-view">
      <svg width={400} height={400}>
        <VictoryPie
          radius={140}
          standalone={false}
          innerRadius={80}
          data={sampleData}
        />
        <VictoryPie
          radius={60}
          standalone={false}
          //   innerRadius={50}
          data={sampleData}
        />
      </svg>
      {/* <svg viewBox={"0 0 400 400"}></svg> */}
    </div>
  );
};

export default AnalysisView;
