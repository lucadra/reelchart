function draw_reel_line(data, selected_word, ids, width, height, max_count) {
    // select the svg element
    svg = d3
        .select(".wrapper")
        .select("svg")
        
    // append a group to the svg
    container = svg.append("g").attr("class", "reel_line");
    // for each id, add a group to the container
    groups = container
        .selectAll("g")
        .data(ids)
        .enter()
        .append("g")
        .attr("class", "reel_line_group")
        .attr("id", (d) => d)
        .attr("transform", (d, i) => "translate(0 ," + -(((width / 20) * 9) / 16)*1.2 + ")");

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
      .attr("x", (d, i) => i * (width / 20))
      .attr("opacity", function (d, i) {
        var count = data.filter(
          (e) =>
            e.id == this.parentNode.id && e.segment == i && e.word == selected_word
        ).length;
        return (count / max_count) + 0.0005;
      })

    }