import MyVideo from "./assets/myvideo.mp4";
import './App.css';
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <>
      <VideoPlayer src={MyVideo} /> {/* Corrected "srec" to "src" */}
    </>
  );
}

export default App;
