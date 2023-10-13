"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from "@fortawesome/free-brands-svg-icons"
// import type { GetServerSideProps } from "next";


// import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import SpotifyWebApi from 'spotify-web-api-js';
// import axios from 'axios';
import { ColorExtractor } from 'react-color-extractor';
import Link from 'next/link';
// import SpotifyPlayer from 'react-spotify-web-playback';

import { getTokenFromUrl, loginUrl } from '../spotify';
import { IUser, IPlaylist } from '@/interfaces';
import Sidebar from '@/components/Sidebar';
import SongTable from '@/components/SongTable';
import SongPlayer from '@/components/SongPlayer';

// const faPropIcon = faBook as IconProp;
config.autoAddCss = false;

const spotify = new SpotifyWebApi();


const loginModal = () => {
  return (
    <div className='text-center w-full text-black'>
      <div className='relative top-[40%]'>
        <Link className='rounded-full bg-[#1ED760] p-5 hover:opacity-60' href={loginUrl}>
          <FontAwesomeIcon className='relative top-1' size='2x' icon={faSpotify}/>
          <span className='ml-2'>Sign in with Spotify!</span>
        </Link>
      </div>
    </div>
  )
}


const Page = () => {

  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);
  // const [filter, setFilter] = useState<string>('');
  const [playlists, setPlaylists] = useState<IPlaylist[] | []>([]);
  const [currPlaylist, setCurrPlaylist] = useState<IPlaylist | null>(playlists ? playlists[0] : null);
  const [playlistImage, setPlaylistImage] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');
  const [currentSong, setCurrentSong] = useState<any>(null);
  

  // const responseTime = process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE;

  // const searchSongs = async() => {
  //   const { data } = await axios.get("https:api.spotify.com/v1/search", {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer`
  //     },
  //     params: {
  //       q: filter,
  //       type: "song"
  //     }
  //   })
  // }

  const getColors = (colors: string[]) => {
    setBgColor(colors[0]);
  }

  const setNewPlaylist = (playlist: IPlaylist) => {
    setCurrPlaylist(playlist);
    setPlaylistImage(playlist.images[0]?.url)
  }

  const renderUserInfo = () => {

    if(user) {
      return (
        <div className='flex row absolute items-center bottom-0'>
          <div className='w-6 h-6 rounded-full' style={{background: `url(${user.images[0]?.url})`, backgroundSize: 'cover'}}></div>
          <p className='whitespace-nowrap font-bold text-sm ml-2'>{user.display_name}</p>
          <p className='ml-2'>•</p>
          {currPlaylist && currPlaylist.tracks && <p className='whitespace-nowrap text-sm ml-2'>{currPlaylist.tracks.total} songs</p>}
        </div>
      )
    }
  }

  useEffect(() => {
    let fetched = false;

    if(!fetched) {
      
      const _spotifyToken = getTokenFromUrl().access_token;

      const fetchData = async (userId: string) => {
        spotify.getUserPlaylists(userId).then((data: any) => {
          const fetchedPlaylists = data?.items;

          setPlaylists(fetchedPlaylists);
          setCurrPlaylist(fetchedPlaylists[0])
          setPlaylistImage(fetchedPlaylists[0]?.images[0]?.url);
        }).catch(err => console.log("ERR:", err))
      
      }
  
      if(_spotifyToken) {
        setSpotifyToken(_spotifyToken);
        spotify.setAccessToken(_spotifyToken);
  
        spotify.getMe().then((user: any) => {
          console.log("DIS YOU:", user)
          fetchData(user.id)
          setUser(user)

          fetched = true;
        })
      }
    }
  }, [spotifyToken]);
  
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {!user && loginModal()}
      {user && <Sidebar 
        playlists={playlists} 
        setNewPlaylist={setNewPlaylist} 
        currPlaylist={currPlaylist}
      />}
      {user && <main 
        style={{background: `linear-gradient(to bottom, ${bgColor}, #000)`}} 
        className="h-[100vh] rounded-lg flex-1 min-w-0 overflow-auto m-4 p-5 ml-0"
      >
        <div className={`flex row rounded-xl`}>
         {playlistImage && 
          <ColorExtractor getColors={getColors}>
            <img className='w-40' src={playlistImage || currPlaylist?.images[0]?.url} />
          </ColorExtractor>}
          {currPlaylist && 
          <div className='flex column items-center relative ml-3'>
            <p className='absolute top-0 text-xs text-[#fff9]'>Playlist</p>
            <p className='leading[2.7rem] text-5xl font-bold'>{currPlaylist.name}</p>
            {currPlaylist.description && <p className='absolute leading-3 text-xs text-[#fff9] bottom-7 mb-1'>{currPlaylist.description}</p>}
            {user && user.images && renderUserInfo()}
          </div>}
        </div>
        {currPlaylist && <SongTable currentSong={currentSong} setCurrentSong={setCurrentSong} playlistId={currPlaylist.id} spotifyToken={spotifyToken} />}
        {/* need to check for premium */}
      </main>}

       {/* need to check for premium */}
       {currentSong &&
          <SongPlayer currentSong={currentSong} token={spotifyToken} />
       }
    </div>
  )
}

export default Page;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   if (context.req.cookies["spotify-token"]) {
//     const token: string = context.req.cookies["spotify-token"];
//     return {
//       props: { token: token },
//     };
//   } else {
//     return {
//       props: { token: "" },
//     };
//   }
// };
