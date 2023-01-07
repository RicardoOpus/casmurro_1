$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
});

function pageChange(place, page, script) {
  $(place).load(page, function () {
    $.getScript(script, function () {});
  });
}

function convertDateBR(dateUS) {
  const date = dateUS;
  const [day, month, year] = date.split('-');
  const dateBR = [year, month, day].join('/');
  return dateBR;
}