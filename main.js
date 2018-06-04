var margin = { top: 40, bottom: 100, left: 30, right: 40 };

width = 1200 - margin.left - margin.right;
height = 600 - margin.top - margin.bottom;

d3.json("./user.json").then(function(data) {
  legendVals = d3
    .set(
      data.map(function(d) {
        return d.building;
      })
    )
    .values();
  console.log(legendVals);
  data.forEach(d => {
    // legvals= d.building;
    d.height = +d.height;
  });

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("border", "2px solid black");

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color = d3
    .scaleOrdinal()
    .domain(legendVals)
    .range(["#1F77B4", "#FF7F0E", "#2CA02C", "#8A3DA0", "#22795F"]);

  var scaleX = d3
    .scaleBand()
    .domain(data.map(d => d.building))
    .range([0, width])
    .paddingInner(0.4)
    .paddingOuter(0.4);

  // console.log(scaleX("burj khalifa"))
  // console.log(scaleX("qutub minar"))
  // console.log(scaleX("taj mahal"))

  var scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([height, 0]);

  var x = d3.axisBottom().scale(scaleX);
  var y = d3.axisLeft().scale(scaleY);

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x)
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .attr("text-anchor", "end");

  g.append("g")
    .attr("class", "y-axis")
    .call(y)
    .attr("transform", "translate(10,10)");

  var rect = g
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => {
      return scaleX(d.building);
    })
    .attr("y", d => {
      return scaleY(d.height);
    })
    .attr("width", scaleX.bandwidth())
    .attr("height", d => {
      return height - scaleY(d.height);
    })
    .style("fill", (d, i) => {
      return color(i);
    })
    .on("mouseover", function(d, i) {
      d3.select(this).style("fill", d3.rgb(color(i)).darker(2));
    })
    .on("mouseout", function(d, i) {
      d3.select(this).style("fill", color(i));
      tooltip.style("display", "none");
    })
    // .on("mousemove",function(d){
    //     var xpos=d3.mouse(this)[0] - 10;
    //     var ypos=d3.mouse(this)[1] - 10;
    //     tooltip.attr("transform","translate("+xpos+","+ypos+")")
    //     tooltip.html(d.building+":"+d.height)
    // });
    .on("mousemove", function(d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 25 + "px");
      tooltip.style("display", "inline-block");
      var x = d3.event.pageX,
        y = d3.event.pageY;
      var elements = document.querySelectorAll(":hover");
      l = elements.length;
      l = l - 1;
      elementData = elements[l].__data__;
      tooltip.html(d.building + "<br>" + d.height);
    });

  // var tooltip= svg.append("g")
  // .attr("class","toolTip")
  // .style("display","none");

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip");

  // tooltip.append("text")
  // .attr("x",15)
  // .attr("dy","1.2em")
  // .style("font-size","1.25em")
  // .attr("font-weight","bold");

  // var legend=g.attr("class","legends").data(color.domain()).enter().append("g")
  //                         .attr("transform","translate(0,10)");

  // legend.append("rect")
  //                     .attr("x",400)
  //                     .attr("y",10)
  //                     .attr("height",10)
  //                     .attr("width",10)
  //                     .style("fill",color)
  //                     })
  // legend.append("text").attr("x",410)
  //                     .attr("y",110)
  //                     .text((d,i)=>{
  //                         return d
  //                     })
  //                     .attr("text-anchor","start")
  //                     .style("font-size",15)

  // var legend = svg
  // .selectAll(".legend")
  // .data(color.domain())
  // .enter().append("g")
  // .attr("class", "legend")
  // .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);
  //     // .on("click",function(d){
  //     //     var active= d.active ? false : true;
  //     //     newopacity= active? 0 :  1;
  //     //     d3.select("color").style("opacity", newopacity);
  //     //     d.active = active;
  //     // });

  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d; });
});
