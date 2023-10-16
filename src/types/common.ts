
// import { ReactNode } from 'react';

import { ERROR_TYPE } from '../constants';

export type ErrorType = (typeof ERROR_TYPE)[keyof typeof ERROR_TYPE];