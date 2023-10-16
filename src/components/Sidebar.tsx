import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SpotifyPlaylist } from '@/types/spotify';
import { renderStyles } from '@/modules/utils';

interface SidebarProps {
    playlists: SpotifyPlaylist[];
    setNewPlaylist: (playlist: SpotifyPlaylist) => void;
    currPlaylist: SpotifyPlaylist | null;
    isSmallScreen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ playlists, setNewPlaylist, currPlaylist, isSmallScreen }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    useEffect(() => {}, []);

    const renderPlaylistImg = (image: string): React.ReactNode => {
        if (image) {
            return (
                <div
                    style={{
                        height: '48px',
                        width: '48px',
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                    }}
                    className="rounded"
                ></div>
            );
        } else {
            return (
                <div className="flex items-center justify-center rounded bg-neutral-700 w-12 h-12">
                    <FontAwesomeIcon size="lg" icon={faMusic} />
                </div>
            );
        }
    };

    const renderPlaylists = () => {

        return playlists.map((playlist: SpotifyPlaylist): React.ReactNode => {
            const isCurrent: boolean = currPlaylist?.name === playlist.name;

            return (
                <div
                    key={playlist.id}
                    className={
                        `flex row rounded cursor-pointer p-1 mb-1 hover:bg-neutral-700
                        ${isCurrent ? ' bg-neutral-700' : ''}
                    `}
                    onClick={() => setNewPlaylist(playlist)}
                >
                    {renderPlaylistImg(playlist.images[0]?.url)}
                    {!isCollapsed && (
                        <div className="ml-3 mt-1">
                            <p className={`${isCurrent ? 'text-[var(--spotify-green)]' : 'text-[#fff]'} text-[14px]`}>
                                {playlist.name}
                            </p>

                            {/* Needs length check for max-width */}
                            <p className="text-sm opacity-40">Playlist • {playlist.owner.display_name}</p>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <nav 
            className={renderStyles(
                `h-[100vh] rounded-lg flex-1 min-w-0 overflow-auto m-4 ml-0 ${isCollapsed ? 'w-20' : 'w-80'} `,
                isSmallScreen,
                currPlaylist,
                "max-sm:hidden",
                "max-sm:w-full"
            )}
       >
            <div className="flex justify-between row p-5">
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex row text-[#fff9] cursor-pointer hover:text-white"
                >
                    <FontAwesomeIcon className={`${isCollapsed ? 'align-center' : ''} ml-1`} size="2x" icon={faBook} />
                    {!isCollapsed && <p className="ml-4 mt-1 font-bold">Your Library</p>}
                </div>

                {/* future: for playlist creation */}
                {/* <div className='opacity-40'>
                    <FontAwesomeIcon size="lg" icon={faPlus}/>
                </div> */}

            </div>
            <div className="p-3 h-[100vh] overflow-y-scroll">{renderPlaylists()}</div>
        </nav>
    );
};

export default Sidebar;
