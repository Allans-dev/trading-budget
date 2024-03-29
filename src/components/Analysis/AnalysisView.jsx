import React from "react";

import { VictoryPie } from "victory";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import "./analysis_styles.css";

const AnalysisView = (props) => {
  const { stocksOuter, stocksInner, budgetInner, budgetOuter } = props;

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
      <Carousel
        centerMode={false}
        width={window.matchMedia("(max-width: 1200px)").matches ? 370 : 500}
        showStatus={false}
        showIndicators={false}
        autoPlay={false}
        interval={10000}
        showThumbs={false}
      >
        <svg viewBox="0 0 400 400">
          <VictoryPie
            radius={140}
            standalone={false}
            innerRadius={80}
            data={stocksOuter}
            labelRadius={({ innerRadius }) => innerRadius + 20}
            padAngle={({ datum }) => 2}
            labelPlacement={({ index }) => "perpendicular"}
            colorScale={profitLossColors}
          />
          <VictoryPie
            radius={70}
            standalone={false}
            data={stocksInner}
            labelRadius={({ innerRadius }) => innerRadius + 35}
            style={{
              data: {
                fill: ({ datum }) =>
                  datum.x === "profit" ? "#8AA31F" : "#F06151",
              },
            }}
            padAngle={({ datum }) => 5}
          />
        </svg>
        <svg viewBox="0 0 400 400">
          <VictoryPie
            radius={140}
            standalone={false}
            innerRadius={80}
            data={budgetOuter}
            labelRadius={({ innerRadius }) => innerRadius + 70}
            style={{
              data: {
                fillOpacity: 0.9,
                stroke: "#e4e4e4",
                strokeWidth: 0.5,
              },
            }}
            labelPlacement={({ index }) => "perpendicular"}
            colorScale={colors}
          />
          <VictoryPie
            radius={70}
            standalone={false}
            data={budgetInner}
            labelRadius={({ innerRadius }) => innerRadius + 100}
            style={{
              data: {
                fillOpacity: 0.9,
                stroke: "#e4e4e4",
                strokeWidth: 0.5,
              },
            }}
            colorScale={colors}
          />
        </svg>
      </Carousel>
    </div>
  );
};

export default AnalysisView;
