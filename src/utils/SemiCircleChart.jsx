import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SemiCircleChart = ({ percentage, color, label }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const validatedPercentage = validatePercentage(percentage);
    const width = 100;
    const height = 60;
    const radius = 50;

    // Clear the previous SVG content before drawing
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height})`);

    // Background arc (full semi-circle)
    const backgroundArc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2) // Start from bottom left
      .endAngle(Math.PI / 2); // End at bottom right

    svg.append('path')
      .attr('d', backgroundArc)
      .attr('fill', '#ccc'); // Light gray background

    // Foreground arc (actual percentage)
    const arc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2) // Start from bottom left
      .endAngle(-Math.PI / 2 + (Math.PI * (validatedPercentage / 100))); // Adjusted to use validated percentage

    svg.append('path')
      .attr('d', arc)
      .attr('fill', color);

    // Add the percentage label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-10px')
      .style('font-size', '12px')
      .text(`${validatedPercentage}%`);

    // Add the custom label under the chart
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '15px')
      .style('font-size', '10px')
      .text(label);

  }, [percentage, color, label]);

  return <svg ref={chartRef}></svg>;
};

// Wrapper component to handle positioning of Goal and Deadline
const SemiCircleChartWrapper = ({ goalPercentage, deadlinePercentage }) => {
  return (
    <div className="pocket-progress">
      <div className="chart-container">
        <SemiCircleChart percentage={goalPercentage} color="#0FD6BE" label="Goal" />
        <div className="chart-label" style={{ color: '#0FD6BE'}}>Goal</div>
      </div>
      <div className="chart-container">
        <SemiCircleChart percentage={deadlinePercentage} color="#C20202" label="Deadline" />
        <div className="chart-label" style={{ color: '#C20202'}}>Deadline</div>
      </div>
    </div>
  );
};

export default SemiCircleChartWrapper;

// Helper function to validate percentage value
const validatePercentage = (percentage) => {
  if (isNaN(percentage) || percentage < 0) return 0;
  if (percentage > 100) return 100;
  return Math.round(percentage);
};
