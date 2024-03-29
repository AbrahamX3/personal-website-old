import { useEffect, useState } from "react";

type ProgressBarProps = {
  progress: number;
  duration: number;
  mutate: () => void;
  isPlaying: boolean;
};

const ProgressBar = ({
  isPlaying,
  progress,
  duration,
  mutate,
}: ProgressBarProps) => {
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }
  function convertMsToTime(progress: number, duration: number) {
    let durationSeconds = Math.floor(duration / 1000);
    let durationMinutes = Math.floor(durationSeconds / 60);
    let durationHours = Math.floor(durationMinutes / 60);

    durationSeconds = durationSeconds % 60;
    durationMinutes = durationMinutes % 60;
    durationHours = durationHours % 60;

    if (progress > 0) {
      let progressSeconds = Math.floor(progress / 1000);
      let progressMinutes = Math.floor(progressSeconds / 60);
      let progressHours = Math.floor(progressMinutes / 60);

      progressSeconds = progressSeconds % 60;
      progressMinutes = progressMinutes % 60;
      progressHours = progressHours % 24;

      if (durationHours == 0) {
        return `${padTo2Digits(progressMinutes)}:${padTo2Digits(
          progressSeconds
        )}`;
      } else {
        return `${padTo2Digits(progressHours)}:${padTo2Digits(
          progressMinutes
        )}:${padTo2Digits(progressSeconds)}`;
      }
    } else {
      if (durationHours == 0) {
        return `${padTo2Digits(durationMinutes)}:${padTo2Digits(
          durationSeconds
        )}`;
      } else {
        return `${padTo2Digits(durationHours)}:${padTo2Digits(
          durationMinutes
        )}:${padTo2Digits(durationSeconds)}`;
      }
    }
  }

  const [ProgressTime, setProgressTime] = useState(progress);
  const [DurationTime, setDurationTime] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        if (ProgressTime == DurationTime) {
          mutate();
          clearInterval(interval);
        }
        if (ProgressTime + 1000 >= DurationTime) {
          setProgressTime(duration);
          clearInterval(interval);
        } else {
          setProgressTime((prevCounter) => prevCounter + 1000);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ProgressTime]);

  return (
    <>
      <div className="col-span-3">
        <div className="flex space-x-2 align-middle items-center justify-between">
          <div>{convertMsToTime(ProgressTime, duration)}</div>
          <div className="w-full border-2 border-white/30 backdrop-blur-md bg-transparent rounded-md">
            <div
              className="w-full h-2 rounded-lg bg-white/60"
              style={{
                width: `${(ProgressTime / DurationTime) * 100}%`,
              }}
            />
          </div>
          <div>{convertMsToTime(0, DurationTime)}</div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
