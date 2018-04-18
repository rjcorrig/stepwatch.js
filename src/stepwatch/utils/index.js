export default {
  formatSeconds: function (seconds) {
    var start = seconds >= 3600 ? 11 : 14
    return new Date(1000 * seconds).toISOString().slice(start, 19)
  }
}
