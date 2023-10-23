import React, { useContext, Dispatch } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMusic } from '@fortawesome/free-solid-svg-icons';

import { AppContext, AppContextType } from '@/context/appContext';

import { SpotifyPlaylist } from '@/types/spotify';

interface SidebarProps {
    playlists: SpotifyPlaylist[];
    sidebarCollapsed: boolean;
    setSidebarCollapsed: Dispatch<any>;
    setNewPlaylist: (playlist: SpotifyPlaylist) => void;
    isMobile: boolean | null;
    userImage: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ playlists, setNewPlaylist, sidebarCollapsed, setSidebarCollapsed, isMobile, userImage }):React.ReactElement => {
    const { currentPlaylist } = useContext(AppContext) as AppContextType;

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

    const renderPlaylists = (): React.ReactNode => {

        return playlists.map((playlist: SpotifyPlaylist): React.ReactNode => {
            const isCurrent: boolean = (currentPlaylist?.name === playlist.name) && !isMobile;

            return (
                <div
                    key={playlist.id}
                    className={`flex rounded cursor-pointer p-1 mb-1 ${
                        isCurrent ? 'bg-neutral-700' : ''
                    } hover:bg-neutral-700`}
                    onClick={() => setNewPlaylist(playlist)}
                >
                    {renderPlaylistImg(playlist.images[0]?.url)}
                    {!sidebarCollapsed && (
                        <div className="ml-3 mt-1">
                            <p className={`${isCurrent ? 'text-[var(--spotify-green)]' : 'text-[#fff]'} text-[14px]`}>
                                {playlist.name}
                            </p>

                            {/* Needs length check for max-width */}
                            <p className="text-sm opacity-50">Playlist • {playlist.owner.display_name}</p>
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderWidth = () => {
        if(sidebarCollapsed) return "w-20";
        if(isMobile) return "w-[94%]";

        return "w-80";
    };

    return (
        <nav className={`fixed ${renderWidth()} h-[96%] flex-none rounded-lg bg-neutral-900 top-1 m-3 mb-10 overflow-hidden`}>
            <div className="flex justify-between row p-5">
                <div
                    onClick={setSidebarCollapsed}
                    className={`flex ${isMobile ? "text-white" : "text-[var(--text-color)]"} cursor-pointer hover:text-white`}
                >
                    {isMobile && <div style={{backgroundImage: `url(${userImage})`}} className="bg-cover bg-center w-10 h-10 rounded-full"></div>}
                    {!isMobile && <FontAwesomeIcon className={`${sidebarCollapsed ? 'align-center' : ''} ml-1`} size="2x" icon={faBook} />}
                    {!sidebarCollapsed && <p className="ml-4 mt-2 font-bold">Your Library</p>}
                </div>

                {/* future: for playlist creation */}
                {/* <div className='opacity-50'>
                    <FontAwesomeIcon size="lg" icon={faPlus}/>
                </div> */}

            </div>
            <div className="h-[100vh] p-3 pb-[120px] overflow-y-scroll">{renderPlaylists()}</div>
        </nav>
    );
};

export default Sidebar;
