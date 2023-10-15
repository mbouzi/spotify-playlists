export const ERROR_TYPE = {
    ACCOUNT: 'account',
    AUTHENTICATION: 'authentication',
    INITIALIZATION: 'initialization',
    PLAYBACK: 'playback',
    PLAYER: 'player',
  } as const;
  
  export const STATUS = {
    ERROR: 'ERROR',
    IDLE: 'IDLE',
    INITIALIZING: 'INITIALIZING',
    READY: 'READY',
    RUNNING: 'RUNNING',
    UNSUPPORTED: 'UNSUPPORTED',
  } as const;