/*global Rx */

function setLeft(x) { this.style.left = x + 'px'; }
function setTop(y) { this.style.top = y + 'px'; }
function randomize() { return Math.round(10 * Math.random() - 5); } //random num b/w -5 - +5

var delay = 300;

var mousemove_ = Rx.Observable.fromEvent(document, 'mousemove');

var left_ = mousemove_.map(e => e.clientX);
var top_ = mousemove_.map(e => e.clientY);

// Update the mouse
var themouse = document.querySelector('#themouse');
left_.subscribe(setLeft.bind(themouse));
top_.subscribe(setTop.bind(themouse));

// Update the tail
var mouseoffset = themouse.offsetWidth;
var thetail = document.querySelector('#thetail');
left_
  .map(x => x + mouseoffset)
  .delay(delay)
  .subscribe(setLeft.bind(thetail));
top_
  .delay(delay)
  .subscribe(setTop.bind(thetail));

// Update wagging
var wagDelay = delay * 1.5;
var wagging = document.querySelector('#wagging');
var mouseandtailoffset = mouseoffset + thetail.offsetWidth;
left_
  .map(x => mouseandtailoffset + x)
  .delay(wagDelay)
  .subscribe(setLeft.bind(wagging));

// var waggingDelay_ = Rx.Observable.return(0);
var waggingDelay_ = Rx.Observable
      .interval(100)
      .map(randomize);

top_.delay(wagDelay)
  .combineLatest(
    waggingDelay_,
    (x, y) => x + y)
  .subscribe(setTop.bind(wagging));
