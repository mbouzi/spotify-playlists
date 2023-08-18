"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import { ColorExtractor } from 'react-color-extractor';


import { getTokenFromUrl, loginUrl } from './spotify';
import { IUser, IPlaylist } from '@/interfaces';

const faPropIcon = faBook as IconProp;
config.autoAddCss = false;

const spotify = new SpotifyWebApi();


const loginModal = () => {
  return (
    <>
      <a href={loginUrl}><p>Sign in with Spotify!</p></a>
    </>
  )
}


const Home = () => {

  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [playlists, setPlaylists] = useState<IPlaylist[] | []>([]);
  const [currPlaylist, setCurrPlaylist] = useState<IPlaylist | null>(null);
  const [playlistImage, setPlaylistImage] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');
  

  const responseTime = process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE;

  const searchSongs = async() => {
    const { data } = await axios.get("https:api.spotify.com/v1/search", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer`
      },
      params: {
        q: filter,
        type: "song"
      }
    })
  }

  const getColors = (colors: any) => {
    console.log("LOT::", colors[0])
    setBgColor(colors[0]);
  }

  const setNewPlaylist = (playlist: any) => {
    setCurrPlaylist(playlist);
    setPlaylistImage(playlist.images[0]?.url)
  }

  const renderUserInfo = () => {

    if(user) {
      return (
        <div className='flex row absolute items-center bottom-0'>
          <div className='w-5 h-5 rounded-full' style={{background: `url(${user.images[0]?.url})`, backgroundSize: 'cover'}}></div>
          <p className='ml-2'>{user.display_name}</p>
          {currPlaylist && currPlaylist.tracks && <p className='ml-2'>{currPlaylist.tracks.total} songs</p>}
        </div>
      )
    }
  }

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
    console.log("LISTS:", playlists)
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
            <p className='text-sm opacity-60'>Playlist - {playlist.owner.display_name}</p>
          </div>
        </div>
      )
    })
  }


  useEffect(() => {

    let fetched = false;
    console.log("USER:", user)
    if(!fetched) {
      const _spotifyToken = getTokenFromUrl().access_token;
      // window.location.hash = "";
      
      console.log("TOKEN:", getTokenFromUrl());
  
      const fetchData = async (userId: string) => {
        const { data } = await axios.get(`https:api.spotify.com/v1/users/${userId}/playlists`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${spotifyToken}`
          },
        })

        let playlists = data?.items;
        setPlaylists(playlists);
        setCurrPlaylist(playlists[0])
        setPlaylistImage(currPlaylist?.images[0]?.url);
      }
  
      if(_spotifyToken) {
        setSpotifyToken(_spotifyToken);
  
        spotify.setAccessToken(_spotifyToken);
  
        spotify.getMe().then((user) => {
          console.log("DIS YOU:", user)
          fetchData(user.id)
          setUser(user)

          fetched = true;
        })
      }
    }
   
    
  }, [spotifyToken])

  return (
    <div className="min-h-screen flex">
      {loginModal()}
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

        <div className='p-3'>
          {renderPlaylists()}
        </div>
        
      </nav>

    <main className="flex-1 min-w-0 overflow-auto p-3 pl-0">
      <div  style={{background: `linear-gradient(to bottom, ${bgColor}, #000)`}} className={`flex row rounded-xl p-5`}>
        <ColorExtractor getColors={getColors}><img className='w-60' src={playlistImage} /></ColorExtractor>
        {currPlaylist && <div className='flex column items-center relative ml-3'>
          <p className='absolute top-0 text-xs'>Playlist</p>
          <p className='leading[2.7rem] text-5xl font-bold'>{currPlaylist.name}</p>
          {currPlaylist.description && <p className='absolute leading-3 text-xs opacity-60 bottom-7 mb-1'>{currPlaylist.description}</p>}
          {user && user.images && renderUserInfo()}
        </div>}

        <div>

        </div>
      </div>

        
    </main>
  </div>
  )
}

export default Home;