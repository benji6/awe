var audioCtx = new AudioContext();

var oscillator = audioCtx.createOscillator();

var gainNode = audioCtx.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);


oscillator.type = 'square';
oscillator.frequency.value = 3000; // value in hertz
oscillator.start();

gainNode.gain.value = 0.1;


oscillator.type = 'square';
oscillator.frequency.value = 3000; // value in hertz
oscillator.start();
