import { SpotifyPlaylist } from "@/types";

export const formatDate = (date: string): string => {
    const options: Intl. DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString([],options);
};

export const msToTime = (duration: number): string => {
    let seconds: string | number = Math.floor((duration / 1000) % 60),
      minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
  
    minutes = ((minutes < 10) ? "0" + minutes : minutes);
    seconds = ((seconds < 10) ? "0" + seconds : seconds);
  
    return minutes + ":" + seconds;
};

const shortenLogic = (text: string): string => {
    if (text.length > 20) return text.slice(0, 25) + ' ...';

    return text;
};


export const shortenText = (data: any): string => {

    if (data.artists) {
        let artistText = '';
        const artists = data.artists;

        for (let i = 0; i < artists.length; i++) {
            if (artists.length === 1 || i === artists.length - 1) {
                artistText += artists[i].name + ' ';
            } else {
                artistText += artists[i].name + ', ';
            }
        }

        return shortenLogic(artistText);
    } else {
        return shortenLogic(data);
    }
};

export const renderStyles = (defaultStyles: string, isSmallScreen: boolean, condition: SpotifyPlaylist | null, styles1: string, styles2: string):string => {

    if(isSmallScreen && isSmallScreen) defaultStyles+= ` ${styles1}`;

    if(isSmallScreen && !condition) defaultStyles+= ` ${styles2}`;

    return defaultStyles;
}
