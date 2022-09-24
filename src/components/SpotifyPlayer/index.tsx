// import ProgressBar from "./ProgressBar.svelte";
import { getBaseURL } from "../../utils/baseURL";
import useSWRImmutable from "swr/immutable";

import {
  Options,
  LoadingState,
  ErrorState,
  TrackInfo,
  OptionsContainer,
  RefreshButton,
  ProgressBar,
} from "./SpotifyComponents";

interface TrackData {
  ImageCoverURL: string;
  artist: string;
  duration_ms: number;
  isPlaying: boolean;
  progress_ms: number;
  repeat_state: string;
  shuffle_state: boolean;
  songURL: string;
  title: string;
  error?: string;
  trackURL: string;
}

const SpotifyPlayer = () => {
  const key = `${getBaseURL()}/api/spotify`;
  const interval: number = 40000;
  const options = {
    revalidateOnFocus: true,
    refreshInterval: interval,
  };
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: track,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable(key, fetcher, options);

  const handleRefresh = () => {
    mutate(key);
  };

  return (
    <div className="lg:w-96 h-4 relative w-full">
      {error != undefined ? (
        <ErrorState error={error} />
      ) : isValidating ? (
        <LoadingState />
      ) : track.error ? (
        <ErrorState error={track.error} />
      ) : (
        <div className="flex flex-col w-full h-28 align-middle items-center rounded-lg shadow-md cursor-pointer bg-gray-800 border-gray-700 p-2">
          <div className="grid grid-cols-3 w-full gap-y-2 grid-rows-2">
            <TrackInfo
              url={track.trackURL}
              image={track.ImageCoverURL}
              title={track.title}
              artist={track.artist}
            />
            <OptionsContainer>
              <Options
                isPlaying={track.isPlaying}
                repeat_state={track.repeat_state}
                shuffle_state={track.shuffle_state}
              />
              <RefreshButton handleClick={handleRefresh} />
            </OptionsContainer>
            <ProgressBar
              mutate={handleRefresh}
              progress={track.progress_ms}
              duration={track.duration_ms}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SpotifyPlayer;
