import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

import { IPlaylist } from "@/interfaces";

interface SidebarProps {
    playlists: IPlaylist[];
    setNewPlaylist: (playlist: IPlaylist) => void;
}


const Sidebar:React.FC<SidebarProps> = ({playlists, setNewPlaylist}) => {

    const renderPlaylistImg = (image: string) => {
        if(image) {
          return <div style={{
            height: "48px", 
            width: "48px", 
            backgroundImage: `url(${image})`, backgroundSize: 'cover'
          }} className='rounded'></div>
        } else {
          return <div className='flex items-center justify-center rounded bg-neutral-700 w-12 h-12'><FontAwesomeIcon size="lg" icon={faMusic}/></div>
        }
      }

    const renderPlaylists = () => {
        return playlists.map((playlist: IPlaylist) => {
          return (
            <div 
              key={playlist.id} 
              className='flex row rounded cursor-pointer p-2 mb-1 hover:bg-neutral-700'
              onClick={() => setNewPlaylist(playlist)}
            >
              {renderPlaylistImg(playlist.images[0]?.url)}
              <div className='ml-3'>
                <p className='text-base mb-1'>{playlist.name}</p>
                <p className='text-sm opacity-60'>Playlist • {playlist.owner.display_name}</p>
              </div>
            </div>
          )
        })
      }

    return (
        <nav className="w-80 m-2flex-none rounded-xl bg-neutral-900 m-3">
          <div className='flex justify-between row p-5'>
            <div className='flex row opacity-60'>
              <FontAwesomeIcon size="lg" icon={faBook}/>
              <p className='ml-2 font-bold'>Your Library</p>
            </div>
            <div className='opacity-60'>
              <FontAwesomeIcon size="lg" icon={faPlus}/>
            </div>
          </div>
          <div className='p-3 h-[100vh] overflow-y-scroll'>
            {renderPlaylists()}
          </div>
      </nav>
    )
}

export default Sidebar;