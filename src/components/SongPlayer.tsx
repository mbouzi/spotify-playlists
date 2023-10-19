import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { AppContext, AppContextType } from '@/context/appContext';

import { msToTime } from '@/modules/utils';


const SongPlayer: React.FC = (): React.ReactElement => {

    const { playingSong } = useContext(AppContext) as AppContextType;


    return (
        <div className="fixed bottom-0 w-full z-10 flex bg-black p-5">
            <div className="flex w-1/3">
                <img src={playingSong?.album.images[0].url} className="rounded w-[55px] h-[55px]" alt="" />

                <div className="ml-4 mt-2">
                    <p className="whitespace-nowrap text-sm">
                        {playingSong?.name && playingSong?.name?.length > 25
                            ? playingSong?.name.slice(0, 25) + ' ...'
                            : playingSong?.name}
                    </p>
                    <p className="opacity-50 text-[12px]"> {playingSong?.artists[0].name}</p>
                </div>
            </div>

            <div className="w-1/3 text-center">
                <FontAwesomeIcon
                    className="rounded-full bg-white text-black py-[8px] px-[10px]"
                    icon={faPlay}
                />
                <div className="flex justify-evenly mt-1">
                    <p className="text-[12px] opacity-50">0:00</p>
                    <div className="w-3/4 bg-[#fff3] h-1 mt-2 rounded"></div>
                    <p className="text-[12px] opacity-50">{msToTime(playingSong?.duration_ms)}</p>
                </div>
            </div>

            <div className="w-1/3"></div>
        </div>
    );
};

export default SongPlayer;
