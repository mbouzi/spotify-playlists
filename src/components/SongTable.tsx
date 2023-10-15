import React, { useEffect, useState, Dispatch } from 'react';
import dynamic from 'next/dynamic';
import SpotifyWebApi from 'spotify-web-api-js';
import Moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { msToTime, shortenText } from '@/modules/utils';
import { SpotifySong, SpotifyPlaylistSong, SpotifyPlaylist } from '@/types';


const spotify = new SpotifyWebApi();

const DragDropContext: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.DragDropContext;
        }),
    { ssr: false },
);

const Draggable: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.Draggable;
        }),
    { ssr: false },
);

const Droppable: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.Droppable;
        }),
    { ssr: false },
);


interface SongTableProps {
    spotifyToken: string;
    currentSong: SpotifySong | null;
    currentPlaylist: SpotifyPlaylist | null;
    setCurrentSong: Dispatch<any>;
}

interface IDraggableLocation {
    droppableId: string;
    index: number;
}

interface ICombine {
    draggableId: string;
    droppableId: string;
}

interface IDragResult {
    reason: 'DROP' | 'CANCEL';
    destination?: IDraggableLocation;
    source: IDraggableLocation;
    combine?: ICombine;
    mode: 'FLUID' | 'SNAP';
    draggableId: string;
}

const renderColumnWidth = (index: number): string => {
    if (index === 1 || index === 2) return '40%';
    if (index > 1) return '20%';

    return 'inherit';
};

const playlistColumnTitles = [
    "#",
    "Title",
    "Album",
    "Date added",
    "Length"
]

const SongTable: React.FC<SongTableProps> = ({ spotifyToken, currentSong, setCurrentSong, currentPlaylist }): React.ReactElement => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const [songHovered, setSongHovered] = useState<SpotifySong | null>(null);
    const [songsFetched, setSongsFetched] = useState<boolean>(false);
    
    const renderTitle = (title: string, index: number): React.ReactNode => {
        return (
            <th
                key={index}
                style={{ width: renderColumnWidth(index) }}
                className={`whitespace-nowrap border-none opacity-60 text-sm font-normal text-left px-4 py-2 pt-3`}
            >
                {title}
            </th>
        );
    };

    const renderSongInfo = (value: any, index: number, highlight: boolean): React.ReactNode => {
        if (index === 1) {
            return (
                <td
                    key={index}
                    style={{ width: renderColumnWidth(index) }}
                    className={`flex whitespace-wrap border-none px-4 py-2 text-sm ${!songsFetched ? "cursor-not-allowed": "cursor-pointer"}`}
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
                            onClick={!songsFetched ? (e: React.MouseEvent<HTMLElement>) => e.stopPropagation() : () => setCurrentSong(value)}
                            className="hover:underline"
                            style={{ color: highlight && index < 2 ? 'var(--spotify-green)' : '#fff' }}
                        >
                            {shortenText(value.name)}
                        </p>
                        <p className="opacity-60  whitespace-nowrap">{shortenText(value)}</p>
                    </div>
                </td>
            );
        }

        return (
            <td
                key={index}
                style={{ width: renderColumnWidth(index), color: highlight && index < 2 ? 'var(--spotify-green)' : '#fff9' }}
                className={`whitespace-wrap border-none px-4 py-2 text-sm cursor-pointer ${index === 0 ? "max-w-[40px]" : "asdas"}`}
            >
                {value}
            </td>
        );
    };

    const renderDraggableSong = (track: SpotifySong, song: SpotifyPlaylistSong, trackId: number, index: number, highLight: boolean): React.ReactNode => {
        return (
            <Draggable key={trackId + index} draggableId={trackId} index={index}>
                {(provided: any, snapshot: any) => (
                    <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex row rounded bg-transparent ${
                            snapshot.draggingOver
                                ? 'border-b border-green-400 rounded-b-none '
                                : 'border-b-0'
                        } ${
                            snapshot.isDragging ? 'bg-blue' : 'bg-black'
                        } cursor-pointer hover:bg-[#fff3]`}
                        // tabIndex={0}
                        key={trackId + index}
                        onMouseOver={() => setSongHovered(track)}
                        onMouseLeave={() => setSongHovered(null)}
                    >
                        {songHovered?.name === track.name
                            ? renderSongInfo(
                                    <FontAwesomeIcon
                                        className="mt-3"
                                        size="sm"
                                        icon={faPlay}
                                    />,
                                    0,
                                    highLight,
                                )
                            : renderSongInfo(index + 1, 0, highLight)}
                            {renderSongInfo(track, 1, highLight)}
                            {renderSongInfo(track.album?.name, 2, highLight)}
                            {renderSongInfo(
                            Moment(song.added_at).format('MMM d, YYYY'),
                            3,
                            highLight,
                        )}
                        {renderSongInfo(msToTime(track.duration_ms), 4, highLight)}
                    </tr>
                )}
            </Draggable>
        )
    }

    const onDragEnd = (result: IDragResult): void => {

        if (!result.destination || !currentPlaylist) {  
            return;  
        }  

        const playlistId = currentPlaylist.id,
        rangeStart = ~~result.source.index;

        let insertBefore = ~~result?.destination?.index;

        if(rangeStart < insertBefore) insertBefore += 1;

        spotify.reorderTracksInPlaylist(playlistId, rangeStart, insertBefore).then(() =>  setSongsFetched(false))
        setSongsFetched(false)
    };

    useEffect(() => {
        if (currentPlaylist?.id && spotifyToken) {
            spotify
                .getPlaylistTracks(currentPlaylist.id)
                .then((data: any) => {
                    const fetchedSongs: SpotifySong[] = data?.items;
                    setSongs(fetchedSongs);
                    setSongsFetched(true)
                })
                .catch((err) => console.log('ERR:', err));
        }
    }, [spotifyToken, currentPlaylist, songsFetched]);

    return (
        <div 
            style={{ background: `linear-gradient(to top, #000, #0006)` }} 
            className={`
                ${songs.length < 20 ? "h-full" : ""} 
                ${!songsFetched ? "opacity-50" : ""} 
                p-5`
            }
        >
            <table className="w-full border-none mt-5">
                <thead className="border-b border-[#aaa3]">
                    <tr className="flex">
                        {playlistColumnTitles.map((title: string, index: number) => renderTitle(title, index))}
                    </tr>
                </thead>

                <DragDropContext onDragEnd={(result: IDragResult) => onDragEnd(result)}>
                    <Droppable droppableId="droppable">
                        {(provided: any) => (
                            <tbody ref={provided.innerRef} {...provided.droppableProps} className="relative top-[15px]">
                                {songs &&
                                    songs.map((song: any, index: number) => {
                                        const { track } = song, 
                                        trackId = track.id + index,
                                        highLight = currentSong?.name.toLowerCase() === track.name.toLowerCase();

                                        return (
                                            renderDraggableSong(track, song, trackId, index, highLight)
                                        );
                                    })}
                                    {provided.placeholder}
                            </tbody>
                        )}
                    </Droppable>
                </DragDropContext>
            </table>
        </div>
    );
};

export default SongTable;
