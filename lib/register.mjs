// register.mjs
// Registers the .json6 ESM loader hooks from lib/import.mjs.
//
// Usage:
//   node --import json-6/lib/register.mjs app.mjs
//
// The loader is resolved relative to this file, not the working directory,
// so this works from a consuming package as well as from this repository.
import { register } from 'node:module';

register('./import.mjs', import.meta.url);
