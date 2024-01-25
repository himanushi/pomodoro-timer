import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import "./theme/global.css";
import "./theme/variables.css";

const PomodoroTimer = () => {
  const [workTime, setWorkTime] = useState(25 * 60); // 初期値は25分
  const [breakTime, setBreakTime] = useState(5 * 60); // 初期値は5分
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isWorkTime, setIsWorkTime] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) playBeep();
          return prevTime - 1;
        });
        if (timeLeft === 0) {
          setIsWorkTime(!isWorkTime);
          setTimeLeft(isWorkTime ? breakTime : workTime);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkTime, workTime, breakTime]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleWorkTimeChange = (e: any) => {
    const newWorkTime = e.target.value * 60;
    setWorkTime(newWorkTime);
    if (!isRunning) {
      setTimeLeft(newWorkTime);
    }
  };

  const handleBreakTimeChange = (e: any) => {
    const newBreakTime = e.target.value * 60;
    setBreakTime(newBreakTime);
    if (!isRunning && !isWorkTime) {
      setTimeLeft(newBreakTime);
    }
  };

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const playBeep = () => {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440Hz（A音）
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1); // 1秒後に停止
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div>ステータス: {isWorkTime ? "ワークタイム" : "ブレイクタイム"}</div>
      <div>
        ワークタイム (分):{" "}
        <input
          type="number"
          value={workTime / 60}
          onChange={handleWorkTimeChange}
        />
      </div>
      <div>
        ブレイクタイム (分):{" "}
        <input
          type="number"
          value={breakTime / 60}
          onChange={handleBreakTimeChange}
        />
      </div>
      <div>{formatTime(timeLeft)}</div>
      <button onClick={toggleTimer} type="button">
        {isRunning ? "停止" : "開始"}
      </button>
    </div>
  );
};

export default PomodoroTimer;

const root = document.getElementById("app");
if (root) render(<PomodoroTimer />, root);
