function draw_reelchart(
  data,
  selected_word,
  ids,
  width,
  height,
  max_count,
  chart_title,
) {
  // get top 10 most common words

  svg = d3
    .select(".wrapper")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", 12);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(chart_title)
    .on("click", function () {
      displayCommonWords(chart_title, data);
    });

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
    .selectAll("img")
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

  //////////////////////////
  ////// MOUSE EVENTS //////
  //////////////////////////

  frames
    .on("mouseover", function (d, i) {
      d3.select(this)
        .attr("width", (width / 20) * 1.5)
        .attr("height", (((width / 20) * 9) / 16) * 2.5)
        .attr("x", i * (width / 20) - (width / 20) * 0.25)
        .attr("y", -(((width / 20) * 9) / 16) * 0.8)
        .attr("opacity", 1)
        .attr("xlink:href", function () {
          return "img/" + this.parentNode.id + "_" + i + ".jpg";
        })
        .style("cursor", "pointer")
        .style("box-shadow", "0 0 10px 5px rgba(0, 0, 0, 0.5)")
        .raise()
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
        .attr("xlink:href", function () {
          return "img/" + this.parentNode.id + "_" + i + ".jpg";
        })
        .attr("opacity", function () {
          var count = data.filter(
            (m) =>
              m.id == this.parentNode.id &&
              m.segment == i &&
              m.word == selected_word
          );
          return count == 0 ? 0.1 : 1;
        });
    })
    .on("click", function (d, i) {
      var count = data.filter(
        (m) =>
          m.id == this.parentNode.id &&
          m.segment == i &&
          m.word == selected_word
      ).length;
      if (count) {
        appendPopup(data, selected_word, this, d, i);
      }
    });

  ///////////////////////////
  //// ADJUST FOR LABELS ////
  ///////////////////////////

  longest_text = d3.max(labels.nodes(), (d) => d.getBBox().width);
  let svg_bb = svg.node().getBBox();
  let svg_width = svg_bb.width;
  let svg_height = svg_bb.height;
  let svg_x = svg_bb.x;
  let svg_y = svg_bb.y;

  svg.attr("viewBox", svg_x + " " + svg_y + " " + svg_width + " " + svg_height);

  ///////////////////////////
  //// SET FRAME OPACITY ////
  ///////////////////////////

  groups.selectAll("image").attr("opacity", function (d, i) {
    var count = data.filter(
      (e) =>
        e.id == this.parentNode.id && e.segment == i && e.word == selected_word
    ).length;
    return count == 0 ? 0.1 : 1;
  });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// POPUP ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function appendPopup(data, selected_word, questo, d, i) {
  let popup;

  if (d3.select("#popup").empty() == false) {
    //d3.select("#gray").remove();
    d3.select("#popup").remove();
  }

  popup = d3.select("body").append("div").attr("id", "popup");

  d3.select("body").style("overflow", "hidden");

  gray = d3
    .select("body")
    .append("div")
    .attr("id", "gray")
    .on("click", function () {
      d3.select("body").style("overflow", "auto");
      d3.select("#popup").remove();
      d3.select("#gray").remove();
    });

  let segment_data = data
    .filter(
      (e) =>
        e.id == questo.parentNode.id &&
        e.segment == i &&
        e.word == selected_word
    )
    .sort((a, b) => +a.start_sec - +b.start_sec);

  let min_start_time = d3.min(segment_data, (d) => +d.start_sec);
  let max_start_time = d3.max(segment_data, (d) => +d.start_sec);

  let header = popup.append("div").attr("id", "popup_header");

  let ytvid = popup
    .append("div")
    .attr("id", "ytvid")
    .append("iframe")
    .attr("width", "560")
    .attr("height", "315")
    .attr("src", function () {
      return (
        "https://www.youtube.com/embed/" +
        questo.parentNode.id +
        "?start=" +
        Math.floor(min_start_time) +
        "&autoplay=1"
      );
    })
    .attr("frameborder", "0")
    .attr(
      "allow",
      "accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
    )
    .attr("allowfullscreen", "");

  let table = popup.append("table").attr("id", "popup_table");

  let table_head = table.append("thead").append("tr");
  table_head.append("th").text("Word");
  table_head.append("th").text("Timestamp");

  segment_data.map((d) => {
    let row = table.append("tr");
    // Insert Values
    row.append("td").text(d.word);
    row.append("td").text(d.start_sec);
    // Handle pointer events
    row
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).style("background-color", "lightgray");
      })
      .on("mouseout", function () {
        d3.select(this).style("background-color", "white");
      })
      .on("click", function () {
        ytvid.attr("src", function () {
          return (
            "https://www.youtube.com/embed/" +
            d.id +
            "?start=" +
            Math.floor(d.start_sec) +
            "&autoplay=1"
          );
        });
      });
  });
}

function displayCommonWords(chart_title, data, selected_word) {
  let wordbox;

  if (d3.select("#wordbox").empty() == false) {
    d3.select("#wordbox").remove();
  }

  wordbox = d3.select("body").append("div").attr("id", "wordbox");

  d3.select("body").style("overflow", "hidden");

  gray = d3
    .select("body")
    .append("div")
    .attr("id", "gray")
    .on("click", function () {
      d3.select("body").style("overflow", "auto");
      d3.select("#wordbox").remove();
      d3.select("#popup").remove();
      d3.select("#gray").remove();
    });

  let wordbox_header = wordbox.append("div").attr("id", "wordbox_header");
  wordbox_header.append("h2").text(`Most Common Words in ${chart_title}`);

  let unique_words = [...new Set(data.map((d) => d.word))];
  let word_counts = unique_words.map((word) => {
    return {
      word: word,
      count: data.filter((d) => d.word === word).length,
    };
  });
  word_counts.sort((a, b) => b.count - a.count);

  let table = wordbox.append("table").attr("id", "wordbox_table");

  let table_head = table.append("thead").append("tr");
  table_head.append("th").text("Word");
  table_head.append("th").text("Count");

  word_counts.map((d) => {
    let row = table.append("tr");
    // Insert Values
    row.append("td").text(d.word);
    row.append("td").text(d.count);
    // Handle pointer events
    row
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).style("background-color", "lightgray");
      })
      .on("mouseout", function () {
        d3.select(this).style("background-color", "white");
      })
      .on("click", function () {
        d3.select("body").style("overflow", "auto");
        d3.select("#wordbox").remove();
        d3.select("#gray").remove();
        selected_word = d.word;
        d3.select("#searchInput").property("value", selected_word);
        d3.select("#submitButton").dispatch("click");
      });
  });
}
