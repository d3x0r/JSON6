import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./lib/import.mjs', pathToFileURL('./'));
