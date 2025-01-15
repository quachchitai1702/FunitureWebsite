import EventEmitter from 'events';

const _emitter = new EventEmitter();
_emitter.setMaxListeners(0);//umlimit listen

export const emitter = _emitter;