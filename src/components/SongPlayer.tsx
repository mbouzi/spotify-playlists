import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ColorExtractor } from 'react-color-extractor';

import { AppContext, AppContextType } from '@/context/appContext';

import { msToTime } from '@/modules/utils';


const SongPlayer: React.FC = (): React.ReactElement => {

    const { playingSong, isMobile } = useContext(AppContext) as AppContextType;
    const [bgColor, setBgColor] = useState<string | null>(null);


    return (
        <div 
            style={{background: isMobile ? `${bgColor}` : "#000"}} 
            className={`fixed flex w-full bottom-0 ${isMobile ? "w-[92%] m-auto right-0 left-0 rounded mb-3 p-2" : "p-5"} z-10`}
        >
            <div className="flex w-1/3">
                <ColorExtractor getColors={(colors: string[]) => setBgColor(colors[0])}>
                    <img 
                        src={playingSong?.album.images[0].url} 
                        className={`rounded ${isMobile ? "w-[40px] h-[40px]" : "w-[55px] h-[55px]"}`}
                        alt={playingSong?.name}
                    />
                </ColorExtractor>

                <div className={`${isMobile ? "ml-3 mt-1" : "ml-4 mt-2"}`}>
                    <p className="whitespace-nowrap text-sm">
                        {playingSong?.name && playingSong?.name?.length > 25
                            ? playingSong?.name.slice(0, 25) + ' ...'
                            : playingSong?.name}
                    </p>
                    <p className="opacity-50 text-[12px] whitespace-nowrap"> {playingSong?.artists[0].name}</p>
                </div>
            </div>

            {!isMobile && 
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
            }

            {isMobile &&  
                <FontAwesomeIcon
                    className="absolute rounded-full text-white py-[8px] px-[10px] right-1 top-[12px]"
                    size='lg'
                    icon={faPlay}
                />
            }

            <div className="w-1/3"></div>
        </div>
    );
};

export default SongPlayer;
