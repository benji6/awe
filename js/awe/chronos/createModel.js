module.exports = ({bpm}) => {
  const getBpm = () => bpm;
  const setBpm = (value) => bpm = value;
  const getTimeInterval = () => 60000 / bpm / 2;

  var playing = false;

  const getIsPlaying = () => playing;
  const setIsPlaying = (boo) => playing = boo;

  return {
    getBpm,
    getIsPlaying,
    getTimeInterval,
    setBpm,
    setIsPlaying
  };
};
