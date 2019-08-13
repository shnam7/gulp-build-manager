/**
 * common types
 */

import * as gulpObject from 'gulp';

export type GulpStream = NodeJS.ReadWriteStream;
export type Stream = GulpStream | undefined;
export type Options = { [key: string]: any; }

export const gulp = gulpObject;
