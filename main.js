var selected_word;
let word_count = 0;
function sortIds (data, youtube_data) {
  const ids = [...new Set(data.map((d) => d.id))];
  ids.sort((a, b) => {
    return (
      youtube_data.filter((d) => d.id == b)[0].views -
      youtube_data.filter((d) => d.id == a)[0].views
    );
  });
  return ids;
}

Promise.all([
  d3.csv("data_1/reelchart_table_referenced.csv"), 
  d3.csv("data_1/youtube_report.csv"),
  d3.csv("data_2/reelchart_table_referenced.csv"),
  d3.csv("data_2/youtube_report.csv"), 
]).then(function (files) {

  const data_1 = files[0];
  const youtube_data_1 = files[1];
  const ids_1 = sortIds(data_1, youtube_data_1);

  const data_2 = files[2];
  const youtube_data_2 = files[3];
  const ids_2 = sortIds(data_2, youtube_data_2);

  var selected_word = null;
  var width = document.body.clientWidth;
  var height = document.body.clientHeight; 

  let data = [...data_1, ...data_2];

  const words = [
      ...new Set(
        data
          .sort((a, b) => data.filter((d) => d.word == b.word).length - data.filter((d) => d.word == a.word).length)
          .map((d) => d.word)
      ),
  ];

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

  submitButton = inputbox_wrapper.append("input").attr("type", "submit").attr("value", "Search").attr("id", "submitButton");

  //prevent page from reloading on submit
  submitButton.on("click", function () {
    d3.event.preventDefault();
    selected_word = d3.select("#searchInput").property("value");
    d3.selectAll("svg").remove();
    word_count = data.filter((d) => d.word == selected_word).length;
    draw_reelchart(data_1, selected_word, ids_1, width, height, word_count, 'BBC');
    draw_reelchart(data_2, selected_word, ids_2, width, height, word_count, 'FOX News');
  });

  form.on("submit", function (event) {
    d3.event.preventDefault();
    selected_word = d3.select("#searchInput").property("value");
    d3.selectAll("svg").remove();
    word_count = data.filter((d) => d.word == selected_word).length;
    draw_reelchart(data_1, selected_word, ids_1, width, height, word_count, 'BBC');
    draw_reelchart(data_2, selected_word, ids_2, width, height, word_count, 'FOX News');
  });

  autocomplete(document.getElementById("searchInput"), words);
  draw_reelchart(data_1, selected_word, ids_1, width, height, word_count, 'BBC');
  draw_reelchart(data_2, selected_word, ids_2, width, height, word_count, 'FOX News');
})

function updateCharts() {
  d3.selectAll("svg").remove();
  draw_reelchart(data_1, selected_word, ids_1, width, height, word_count, 'BBC');
  draw_reelchart(data_2, selected_word, ids_2, width, height, word_count, 'FOX News');
}
