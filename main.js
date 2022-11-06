var selected_word;

d3.csv("data/reelchart_table_nonzero.csv", function (data) {
  const ids = [...new Set(data.map((d) => d.id))];
  const words = [
    ...new Set(data.sort((a, b) => b.count - a.count).map((d) => d.word)),
  ];

  var selected_word = words[0];
  var width = document.body.clientWidth;
  var height = document.body.clientHeight; 

  var max_count = d3.max(
    data.filter((d) => d.word == selected_word),
    (d) => +d.count
  );

  wrapper = d3.select("body").append("div").attr("class", "wrapper");

  form = wrapper
    .append("form")
    .attr("autocomplete", "off")
    .append("div")
    .attr("class", "autocomplete");

  inputbox_wrapper = form.append("div").attr("class", "inputbox_wrapper");

  inputbox = inputbox_wrapper
    .append("input")
    .attr("id", "searchInput")
    .attr("type", "text")
    .attr("name", "search")
    .attr("placeholder", "Search entity...");

  submitButton = inputbox_wrapper.append("input").attr("type", "submit").attr("value", "Search");

  //prevent page from reloading on submit
  submitButton.on("click", function () {
    d3.event.preventDefault();
    selected_word = d3.select("#searchInput").property("value");
    svg.remove();
    max_count = d3.max(
      data.filter((d) => d.word == selected_word),
      (d) => +d.count
    );
    draw_reelchart(data, selected_word, ids, width, height, max_count);
    draw_reel_line(data, selected_word, ids, width, height, max_count);
  });

  form.on("submit", function (event) {
    d3.event.preventDefault();
    selected_word = d3.select("#searchInput").property("value");
    svg.remove();
    max_count = d3.max(
      data.filter((d) => d.word == selected_word),
      (d) => +d.count
    );
    draw_reelchart(data, selected_word, ids, width, height, max_count);
    draw_reel_line(data, selected_word, ids, width, height, max_count);
  });

  autocomplete(document.getElementById("searchInput"), words);

  draw_reelchart(data, selected_word, ids, width, height, max_count);
  draw_reel_line(data, selected_word, ids, width, height, max_count);
});
