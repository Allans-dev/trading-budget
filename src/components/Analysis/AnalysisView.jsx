import React from "react";

import { VictoryPie } from "victory";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import "./analysis_styles.css";

const AnalysisView = (props) => {
  const { stocksOuter, stocksInner, budgetInner, budgetOuter } = props;

  console.log(budgetOuter);

  console.log(budgetInner);

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
    <div className="analysis-view">
      <Carousel centerMode={false} width={340}>
        <svg viewBox="0 0 360 360">
          <VictoryPie
            radius={140}
            standalone={false}
            innerRadius={80}
            data={stocksOuter}
            labelRadius={({ innerRadius }) => innerRadius + 25}
            colorScale={profitLossColors}
          />
          <VictoryPie
            radius={70}
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
        <svg viewBox="0 0 360 360">
          <VictoryPie
            radius={140}
            standalone={false}
            innerRadius={80}
            data={budgetInner}
            labelRadius={({ innerRadius }) => innerRadius + 25}
            colorScale={colors}
          />
          <VictoryPie
            radius={70}
            standalone={false}
            data={budgetOuter}
            labelRadius={({ innerRadius }) => innerRadius + 25}
            colorScale={colors}
          />
        </svg>
      </Carousel>
    </div>
  );
};

export default AnalysisView;
