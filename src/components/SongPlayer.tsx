import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { SpotifySong, SpotifyPlaylist } from '@/types';
import { msToTime } from '@/modules/utils';

interface SongPlayerProps {
    token: string;
    currentSong: SpotifySong;
    currentPlaylist: SpotifyPlaylist;
    isSmallScreen: boolean;
}

const SongPlayer: React.FC<SongPlayerProps> = (props) => {

    // useEffect(() => {
    // }, []);

    return (
        <div className={`
                fixed bottom-0 w-full z-10 flex bg-black p-5
                ${props.currentPlaylist && props.isSmallScreen ? " hidden" : ""}
            `}>
            <div className="flex w-1/3">
                <img src={props.currentSong.album.images[0].url} className="rounded w-[55px] h-[55px]" alt="" />

                <div className="ml-4 mt-2">
                    <p className="whitespace-nowrap text-sm">
                        {props.currentSong.name.length > 25
                            ? props.currentSong.name.slice(0, 25) + ' ...'
                            : props.currentSong.name}
                    </p>
                    <p className="opacity-40 text-[12px]"> {props.currentSong.artists[0].name}</p>
                </div>
            </div>

            <div className="w-1/3 text-center">
                <FontAwesomeIcon
                    className="rounded-full bg-white text-black py-[8px] px-[10px]"
                    icon={faPlay}
                />
                <div className="flex justify-evenly mt-1">
                    <p className="text-[12px] opacity-40">0:00</p>
                    <div className="w-3/4 bg-[#fff3] h-1 mt-2 rounded"></div>
                    <p className="text-[12px] opacity-40">{msToTime(props.currentSong.duration_ms)}</p>
                </div>
            </div>

            <div className="w-1/3"></div>
        </div>
    );
};

export default SongPlayer;
