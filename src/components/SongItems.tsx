'use client';

import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import SpotifyWebApi from 'spotify-web-api-js';

import { AppContext, AppContextType } from '@/context/appContext';
import SongColumn from './SongColumn';
import ConditionalWrapper from './ConditionalWrapper';
import { SpotifySong, SpotifyPlaylistSong } from '@/types';
import { msToTime } from '@/modules/utils';
import { breakPoints } from '@/app/theme';

const spotify = new SpotifyWebApi();

// Dynamic import for Draggable
const Draggable = dynamic(() => import('@hello-pangea/dnd').then((mod) => mod.Draggable), { ssr: false });

interface SongItemsProps {
    songItems: SpotifySong[];
    isTable?: boolean | null;
    setSongResults?: React.Dispatch<any> | null;
}

interface SongField {
    name: string;
    value: SpotifySong | string | React.ReactNode;
    index: number;
    render: boolean | null | undefined | string;
}

const SongItems: React.FC<SongItemsProps> = ({ songItems, isTable, setSongResults }) => {
    const { currentPlaylist, playingSong, songHovered, setSongHovered, setPlaylistSongsFetched, windowSize, isMobile } =
        useContext(AppContext) as AppContextType;

    const addSong = (songUri: string | null) => {
        if (songUri && currentPlaylist && setSongResults) {
            setPlaylistSongsFetched(false);
            spotify
                .addTracksToPlaylist(currentPlaylist.id, [songUri])
                .then(() => {
                    setPlaylistSongsFetched(true);
                    const newSongResults = songItems.filter((item) => songUri !== item.uri);
                    setSongResults(newSongResults);
                })
                .catch((err) => console.log('ERR:', err));
        }
    };

    return (
        <>
            {songItems.map((song: any, index: number) => {
                const track: SpotifySong = isTable ? song.track : song;
                const playlistSong: SpotifyPlaylistSong = song;
                const trackId = `${track.id}-${index}`;
                const highlight = playingSong?.name?.toLowerCase() === track.name.toLowerCase();

                const songFields: SongField[] = [
                    {
                        name: 'number',
                        value:
                            songHovered?.name === track.name ? (
                                <FontAwesomeIcon className="mt-1" size="sm" icon={faPlay} />
                            ) : (
                                index + 1
                            ),
                        index: 0,
                        render: isTable && !isMobile,
                    },
                    { name: 'artist', value: track, index: 1, render: true },
                    {
                        name: 'album',
                        value: track.album?.name,
                        index: 2,
                        render: windowSize && windowSize.windowWidth > breakPoints.xlScreen,
                    },
                    {
                        name: 'dateAdded',
                        value: Moment(playlistSong.added_at).format('MMM d, YYYY'),
                        index: 3,
                        render: isTable && windowSize && windowSize.windowWidth > breakPoints.xlScreen,
                    },
                    { name: 'length', value: msToTime(track.duration_ms), index: 4, render: isTable },
                ];

                return (
                    <ConditionalWrapper
                        key={trackId}
                        condition={isTable}
                        wrapperA={(children) => (
                            <Draggable key={trackId} draggableId={trackId} index={index}>
                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`flex bg-transparent 
                                ${snapshot.isDragging ? 'bg-blue' : 'bg-black'} 
                                ${snapshot.draggingOver ? 'border-b border-green-400 rounded-b-none' : 'border-b-0'}
                                ${isMobile ? '' : 'rounded'} hover:bg-[#fff3]`}
                                        onMouseOver={() => setSongHovered(track)}
                                        onMouseLeave={() => setSongHovered(null)}
                                    >
                                        {children}
                                    </tr>
                                )}
                            </Draggable>
                        )}
                        wrapperB={(children) => (
                            <tr
                                className={`flex rounded bg-transparent hover:bg-[#fff3]`}
                                onMouseOver={() => setSongHovered(track)}
                                onMouseLeave={() => setSongHovered(null)}
                            >
                                {children}
                            </tr>
                        )}
                    >
                        {songFields.map(
                            (field) =>
                                field.render && (
                                    <SongColumn
                                        key={field.name}
                                        value={field.value}
                                        index={field.index}
                                        highlight={highlight}
                                        isTable={isTable}
                                        isHovered={songHovered?.name === track.name}
                                    />
                                ),
                        )}
                        {!isTable && (
                            <td>
                                <p
                                    className="border-2 border-[var(--border-color)] text-xs font-bold rounded-full mt-2 p-2 px-4 cursor-pointer hover:border-white"
                                    onClick={() => addSong(track.uri)}
                                >
                                    Add
                                </p>
                            </td>
                        )}
                    </ConditionalWrapper>
                );
            })}
        </>
    );
};

export default SongItems;
