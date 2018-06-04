var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x0 = d3
  .scaleBand()
  .range([0, width], 0.1)
  .paddingInner(0.1);

var x1 = d3.scaleBand().padding(0.05);

var y = d3.scaleLinear().range([height, 0]);

var color = d3
  .scaleOrdinal()
  .range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00"
  ]);

var xAxis = d3.axisBottom().scale(x0);

var yAxis = d3
  .axisLeft()
  .scale(y)
  .tickFormat(d3.format(".2s"));

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data.csv").then(function(data, error) {
  // var i=0;
  var ageNames = d3.keys(data[0]).filter(function(key) {
    return key !== "State";
  });
  console.log(ageNames[1]);
  data.forEach(d => {
    d.ages = ageNames.map(function(name) {
      return { name: name, value: +d[name] };
    });
  });

  x0.domain(data.map(d => d.State));
  x1.domain(ageNames).rangeRound([0, x0.bandwidth()]);
  y.domain([
    0,
    d3.max(data, function(d) {
      return d3.max(d.ages, function(d) {
        return d.value;
      });
    })
  ]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("text-anchor", "start")
    // .attr("transform","rotate(-90)")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Population");

  var state = svg
    .selectAll(".state")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
      return "translate(" + x0(d.State) + ",0)";
    });

  state
    .selectAll("rect")
    .data(function(d) {
      return d.ages;
    })
    .enter()
    .append("rect")
    .attr("width", x1.bandwidth())
    .attr("x", function(d) {
      return x1(d.name);
    })
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .style("fill", function(d) {
      return color(d.name);
    })
    .on("mouseover", function(d) {
      d3.select(this).style("fill", d3.rgb(color(d.name)).darker(1));
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", color(d.name));
      tooltip.style("display", "none");
    })
    .on("mousemove", function(d, i) {
      tooltip.style("left", d3.event.pageX + 15 + "px");
      tooltip.style("top", d3.event.pageY - 125 + "px");
      tooltip.style("display", "inline-block");
      // tooltip.style("background",color(d.name));
      tooltip.style("border", "2px solid" + color(d.name));
      tooltip.style("color", color(d.name));
      var x = d3.event.pageX,
        y = d3.event.pageY;
      var elements = document.querySelectorAll(":hover");
      l = elements.length;
      l = l - 1;
      elementData = elements[l].__data__;
      tooltip.html(
        "<b><u><h3>Category: </h3></u></b>" +
          ageNames[i] +
          "<br>" +
          "<b><u><h3>Population: </h3></u></b>" +
          d.value
      );
    });

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip");

  var legend = svg
    .selectAll(".legend")
    .data(ageNames)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {
      console.log("color", color(ageNames));
      return color(ageNames[i]);
    });

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
});