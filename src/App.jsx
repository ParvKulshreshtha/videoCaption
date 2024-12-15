import React, { useState, useRef } from 'react';
import videoSrc from "./assets/html.mp4";

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [caption, setCaption] = useState('');
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState(); 
  const [currentTime, setCurrentTime] = useState(); 
  const [previousCaptions, setPreviousCaptions] = useState([]);
  const [upcomingCaptions, setUpcomingCaptions] = useState([]);
  const videoRef = useRef(null);

  const handleUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleTimestampChange = (event) => {
    setTimestamp(event.target.value);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleAddCaption = () => {
    setCaptions([...captions, { time: timestamp, caption }]);
    setTimestamp('');
    setCaption('');
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentTime(formatTimestamp(currentTime * 1000));
      const sortedCaptions = [...captions].sort((a, b) => parseTimestampToSeconds(a.time) - parseTimestampToSeconds(b.time));

      const current = sortedCaptions.find(
        (cap) => parseTimestampToSeconds(cap.time) <= currentTime && parseTimestampToSeconds(cap.time) + 1 >= currentTime
      );

      const captions = sortedCaptions

      const upcoming = sortedCaptions.filter(
        (cap) => parseTimestampToSeconds(cap.time) > currentTime
      );

      setCurrentCaption(current ? current.caption : '');
      setPreviousCaptions(previous);
      setUpcomingCaptions(upcoming);
    }
  };

  const formatTimestamp = (timestamp) => {
    let milliseconds = Math.floor(timestamp % 1000);
    let totalSeconds = Math.floor(timestamp / 1000);
    let seconds = totalSeconds % 60;
    let totalMinutes = Math.floor(totalSeconds / 60);
    let minutes = totalMinutes % 60;
    let hours = Math.floor(totalMinutes / 60);

    milliseconds = milliseconds.toString().padStart(3, '0');
    seconds = seconds.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    hours = hours.toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  };

  const parseTimestampToSeconds = (timeStr) => {
    const timeParts = timeStr.split(':');
    if (timeParts.length === 2) {
      return parseInt(timeParts[0], 10) * 60 + parseFloat(timeParts[1]);
    } else if (timeParts.length === 3) {
      return parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseFloat(timeParts[2]);
    }
    return null;
  };

  const handleAddTimestamp = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      const currentTime = videoRef.current.currentTime;
      setTimestamp(formatTimestamp(currentTime * 1000));
    }
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-4xl font-bold mb-8">Video Player with Captions</h1>

      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={handleUrlChange}
        className="w-3/4 p-3 mb-4 text-lg border rounded-md shadow-sm"
      />

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Enter timestamp (mm:ss)"
          value={timestamp}
          onChange={handleTimestampChange}
          className="w-1/2 p-2 text-base border rounded-md shadow-sm"
        />
        <input
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={handleCaptionChange}
          className="w-1/2 p-2 text-base border rounded-md shadow-sm"
        />
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleAddCaption}
          className="p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Add Caption
        </button>
        <button
          onClick={handleAddTimestamp}
          className="p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
        >
          Add Timestamp
        </button>
      </div>

      {videoUrl && (
        <div className="relative mb-8">
          <video width="640" height="360" controls onTimeUpdate={handleTimeUpdate} ref={videoRef} className="rounded-md shadow-md">
            <source src={videoSrc} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Current Time</h2>
        <p className="text-lg">{currentTime}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Captions</h2>
        <div className="grid grid-cols-1 gap-4">
          {captions.map((cap, index) => (
            <div key={index} className={`p-4 border rounded-md shadow-sm ${currentTime === cap.time ? 'bg-yellow-200' : 'bg-white'}`}>
              <p className="text-sm text-gray-600">{cap.time}</p>
              <p className="text-lg">{cap.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
