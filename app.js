const screen = document.getElementById("screen");
const start = document.getElementById("start");

let isOn = false;
let tapTimer = null;

let touchStartX = 0;
let touchStartY = 0;

const colours = {
  up: "#ff0000",
  down: "#9ed8ff",
  left: "#9b4dff",
  right: "#36d66f"
};

function off() {
  screen.style.background = "#000";
  isOn = false;
}

function onWhite() {
  screen.style.background = "#fff";
  isOn = true;
  beep();
}

function colour(c) {
  screen.style.background = c;
  isOn = true;
}

function doubleTap() {
  if (isOn) {
    off();
  } else {
    onWhite();
  }
}

function beep() {
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 880;

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.12
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);

  } catch (_) {}
}


// START PERFORMANCE
start.addEventListener("click", () => {
  start.remove();
  off();
}, { once: true });


// TOUCH INPUT
screen.addEventListener("touchstart", event => {

  const touch = event.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

}, { passive: true });


screen.addEventListener("touchend", event => {

  const touch = event.changedTouches[0];

  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  const distance = Math.hypot(dx, dy);


  // SWIPE
  if (distance > 50) {

    if (Math.abs(dx) > Math.abs(dy)) {

      if (dx > 0) {
        colour(colours.right);
      } else {
        colour(colours.left);
      }

    } else {

      if (dy > 0) {
        colour(colours.down);
      } else {
        colour(colours.up);
      }
    }

    return;
  }


  // DOUBLE TAP
  if (tapTimer) {

    clearTimeout(tapTimer);
    tapTimer = null;

    doubleTap();

  } else {

    tapTimer = setTimeout(() => {
      tapTimer = null;
    }, 280);

  }

}, { passive: true });
