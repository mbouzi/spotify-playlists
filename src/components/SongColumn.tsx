import React, { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";

import { AppContext, AppContextType } from '@/context/appContext';

import { shortenText } from '@/modules/utils';
import { breakPoints } from "@/app/theme";


interface SongColumnProps {
    index: number;
    highlight: boolean;
    value: any;
    isTable?: boolean | null;
    isHovered: boolean;
}


const SongColumn: React.FC<SongColumnProps> = ({value, index, highlight, isTable, isHovered}): React.ReactElement => {

    const { setPlayingSong, playlistSongsFetched, windowSize, isMobile } = useContext(AppContext) as AppContextType;


    const renderColumnWidth = (index: number): string => {
        const isXLScreen = windowSize && windowSize.windowWidth < breakPoints.xlScreen;

        if(isMobile && index === 1) return '88%';
        if(isMobile && index !== 1) return '5%';
        if(isXLScreen && index === 1) return '80%';
        if (isXLScreen) return '10%';
        if(!isTable) return "45%";
        if (index === 1 || index === 2) return '40%';
        if (index > 1) return '20%';
    
        return 'inherit';
    };

    // change to check based on data
    if (index === 1) {
        return (
            <td
                key={index}
                style={{ width: renderColumnWidth(index) }}
                className={`flex border-none px-4 py-2 text-sm whitespace-wrap ${(!playlistSongsFetched) ? "cursor-not-allowed": ""}`}
            >
                <img
                    src={
                        value.album.images.length > 0
                            ? value.album.images.filter((img: any) => img.height === 64)[0].url
                            : value.album.images[0].url
                    }
                    className="w-[40px] h-[40px]"
                    onClick={!playlistSongsFetched && isTable  ? (e: React.MouseEvent<HTMLElement>) => e.stopPropagation() : () => setPlayingSong(value)}
                />
                <div className="flex flex-col ml-2">
                    <p
                        onClick={!playlistSongsFetched && isTable  ? (e: React.MouseEvent<HTMLElement>) => e.stopPropagation() : () => setPlayingSong(value)}
                        className="hover:underline cursor-pointer"
                        style={{ color: highlight && index < 2 ? 'var(--spotify-green)' : '#fff' }}
                    >
                        {shortenText(value.name)}
                    </p>
                    <p className={`${isHovered ? "text-[#fff]" : "text-[var(--text-color)]"} whitespace-nowrap`}>{shortenText(value)}</p>
                </div>
            </td>
        );
    };


    return (
        <td
            key={index}
            style={{ width: renderColumnWidth(index), color: highlight && index < 2 ? 'var(--spotify-green)' : `${isHovered ? "#fff" : "var(--text-color)"}` }}
            className={`border-none ${index === 0 ? "max-w-[40px] pt-3" : "pt-4"} px-4 py-2 pt-4 text-sm ${isMobile ? "text-right" : ""} table-cell align-middle whitespace-nowrap`}
        >
            {isMobile && index === 4 ? <FontAwesomeIcon icon={faAlignJustify} /> : shortenText(value)}
        </td>
    );
}


export default SongColumn;