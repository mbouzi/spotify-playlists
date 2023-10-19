import React, { useContext } from "react";

import { AppContext, AppContextType } from '@/context/appContext';

import { shortenText } from '@/modules/utils';


interface SongColumnProps {
    index: number;
    highlight: boolean;
    value: any;
    isTable?: boolean | null;
    isHovered: boolean;
}


const SongColumn: React.FC<SongColumnProps> = ({value, index, highlight, isTable, isHovered}): React.ReactElement => {

    const { setPlayingSong, playlistSongsFetched } = useContext(AppContext) as AppContextType;


    const renderColumnWidth = (index: number): string => {
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
                />
                <div className="flex flex-col ml-2">
                    <p
                        onClick={!playlistSongsFetched && isTable  ? (e: React.MouseEvent<HTMLElement>) => e.stopPropagation() : () => setPlayingSong(value)}
                        className="hover:underline cursor-pointer"
                        style={{ color: highlight && index < 2 ? 'var(--spotify-green)' : '#fff' }}
                    >
                        {shortenText(value.name)}
                    </p>
                    <p className={`${isHovered ? "text-[#fff]" : "text-[#fff9]"} whitespace-nowrap`}>{shortenText(value)}</p>
                </div>
            </td>
        );
    }


    return (
        <td
            key={index}
            style={{ width: renderColumnWidth(index), color: highlight && index < 2 ? 'var(--spotify-green)' : `${isHovered ? "#fff" : "#fff9"}` }}
            className={`border-none px-4 py-2 pt-4 text-sm table-cell align-middle whitespace-nowrap ${index === 0 ? "max-w-[40px] pt-3" : "pt-4"}`}
        >
            {shortenText(value)}
        </td>
    );
}


export default SongColumn;