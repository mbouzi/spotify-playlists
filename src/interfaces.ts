
export interface IUser {
    display_name: string;
    external_url: any;
    followers: any;
    href: string;
    id: string;
    images: any[];
    type: string;
    uri: string;
}

export interface IPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: unknown;
    href: string;
    id: string;
    images: any[];
    name: string;
    owner: any;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: any;
    type: string;
    uri: string;
}