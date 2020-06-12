const margin = { left: 100, right: 20, top: 20, bottom: 100 };

// height and width of the group that contains bar chart
const height = 500 - margin.bottom - margin.top;
const width = 500 - margin.left -margin.right;


d3.json('./revenues.json').then((data) => {
  const g = d3.select('#root').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  data.forEach((revenue) => {
    revenue.profit = +revenue.profit;
    revenue.revenue = +revenue.revenue;
  });

  // set y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([height , 0]);
  
  // set x scale
  const x = d3.scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  // construct y axis
  const yAxis = d3.axisLeft(y)
    .tickFormat(revenue => '$' + revenue);

  g.append('g').call(yAxis);

  // construct x axis
  const xAxis = d3.axisBottom(x);

  g.append('g')
    .attr('class', 'left axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  // x axis label
  g.append('text')
    .attr('y', height + 55)
    .attr('x', width / 2 )
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Months');

  // y axis label
  g.append('text')
    .attr('y', -70)
    .attr('x', - height / 2)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenues');

  g.append('g').selectAll('rect').data(data)
    .enter().append('rect')
      .attr('x', (d) => x(d.month))
      .attr('y', (d) => y(d.revenue))
      .attr('height', (d) => height - y(d.revenue))
      .attr('width', x.bandwidth)
      .attr('fill', 'grey');
});
