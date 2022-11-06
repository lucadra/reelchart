function draw_reelchart(data, selected_word, ids, width, height, max_count) {

  svg = d3
    .select(".wrapper")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", 12);

  container = svg.append("g").attr("class", "reelchart");

  groups = container
    .selectAll("g")
    .data(ids)
    .enter()
    .append("g")
    .attr("class", "reelchart_group")
    .attr("id", (d) => d)
    .attr(
      "transform",
      (d, i) => "translate(0 ," + i * (((width / 20) * 9) / 16) + ")"
    );

  labels = groups
    .append("text")
    .attr("class", "reelchart_label")
    .text((d) => d)
    .attr("x", -10)
    .attr("y", (((width / 20) * 9) / 16) * (2 / 3))
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "bottom");

  frames = groups
    .selectAll("image")
    .data(Array(20).fill(0))
    .enter()
    .append("image")
    .attr("class", "reelchart_frame")
    .attr("xlink:href", function (d, i) {
      return "img/" + this.parentNode.id + "_" + i + ".jpg";
    })
    .attr("width", width / 20)
    .attr("height", ((width / 20) * 9) / 16)
    .attr("x", (d, i) => i * (width / 20));

  frames.on("mouseover", function (d, i) {
    d3.select(this)
      .attr("width", (width / 20) * 1.5)
      .attr("height", (((width / 20) * 9) / 16) * 2.5)
      .attr("x", i * (width / 20) - (width / 20) * 0.25)
      .attr("y", -(((width / 20) * 9) / 16) * 0.8)
      .attr("opacity", 1)
      .attr("xlink:href", function () {
        return "img/" + this.parentNode.id + "_" + i + ".gif";
      })
      .raise()
      //select the group that contains the frame and raise it
      .select(function () {
        return this.parentNode;
      })
      .raise();

  })
  .on("mouseout", function (d, i) {
    d3.select(this)
      .attr("width", width / 20)
      .attr("height", ((width / 20) * 9) / 16)
      .attr("x", i * (width / 20))
      .attr("y", 0)
      .attr("xlink:href", function (d, i) {
        return "img/" + this.parentNode.id + "_" + i + ".jpg";
      })
      .attr("opacity", function () {
        var count = data.filter(
          (m) =>
            m.id == this.parentNode.id && m.segment == i && m.word == selected_word
        )
        count = count == undefined ? 0 : count.length > 0 ? count[0].count : 0;
        return (count / max_count) + 0.1;
      });
  });


  longest_text = d3.max(labels.nodes(), (d) => d.getBBox().width);

  svg.attr(
    "viewBox",
    -longest_text * 1.2 +
      " " +
      -(((width / 20) * 9) / 16) * 1.2 +
      " " +
      (width + longest_text * 1.2) +
      " " +
      height
  );

  groups.selectAll("image").attr("opacity", function (d, i) {
    var count = data.filter(
      (e) =>
        e.id == this.parentNode.id && e.segment == i && e.word == selected_word
    );
    count = count == undefined ? 0 : count.length > 0 ? count[0].count : 0;
    return count / max_count + 0.1;
  });
}
