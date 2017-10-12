var tasks = [
  {"startDate":new Date("Jun 1 1983"),"endDate":new Date("Jan 1 1988"),"taskName":"Microsoft","status":"SUCCEEDED"},
  {"startDate":new Date("Jan 1 1988"),"endDate":new Date("Jan 1 1991"),"taskName":"hDC","status":"SUCCEEDED"},
  {"startDate":new Date("Jan 1 1991"),"endDate":new Date("Aug 29 1996"),"taskName":"Express Systems","status":"SUCCEEDED"},
  {"startDate":new Date("Sep 1 1996"),"endDate":new Date("Sep 1 1999"),"taskName":"WRQ","status":"SUCCEEDED"},
  {"startDate":new Date("Sep 1 1999"),"endDate":new Date("Jun 1 2017"),"taskName":"Fast Track","status":"SUCCEEDED"},
  {"startDate":new Date("Jan 1 2005"),"endDate":new Date("Jun 1 2017"),"taskName":"Wild Noodle","status":"SUCCEEDED"},
]

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "SUCCEEDED" : "bar-running",
    "KILLED" : "bar-killed"
};

var taskNames = [ "Microsoft", "hDC", "Express Systems", "WRQ", "Fast Track", "Wild Noodle" ];

tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = tasks[tasks.length - 1].endDate;
tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = tasks[0].startDate;

var format = "%Y";

var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);
gantt(tasks);
