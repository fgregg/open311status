module.exports = function(req, res) {
  res.render('index', {
    title: "Open311Status",
    layout : false
  });
}