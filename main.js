const playButton = document.getElementById('play');
const blockSize = 4096;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.audio = null;

function init() {
  audio = new AudioContext({ latencyHint: blockSize/48000 });
  const fade = audio.createGain();
  const noise = audio.createScriptProcessor(blockSize,0,2);
  var lastOut = 0.0;
  noise.onaudioprocess = e => {
    var out = e.outputBuffer;
    for (var chan=0; chan<out.numberOfChannels; chan++) {
      var block = out.getChannelData(chan);
      for (var i=0; i<blockSize; i++) {
          var white = Math.random() * 2 - 1;
          block[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = block[i];
          block[i] *= 3.5; // (roughly) compensate for gain
      }
    }
  }
  noise.connect(fade);
  fade.connect(audio.destination);
  fade.gain.value = 0;
  fade.gain.linearRampToValueAtTime(0.1, audio.currentTime+5);
}
playButton.onclick = () => {
  playButton.remove();
  init();
}
