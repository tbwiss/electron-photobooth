const electron = require('electron');
const video = require('./video');
const countdown = require('./countdown');
const effects = require('./effects');
const flash = require('./flash');

const { ipcRenderer: ipc, shell, remote } = electron;

const images = remote.require('./images');

let canvasTarget;
let serisouly;
let videoSrc;

function formatImgTag(document, bytes) {
  const div = document.createElement('div');
  div.classList.add('photo');
  const close = document.createElement('div');
  close.classList.add('photoClose');
  const img = new Image();
  img.classList.add('photoImg');
  img.src = bytes;
  div.appendChild(img);
  div.appendChild(close);
  return div;
}

window.addEventListener('DOMContentLoaded', _ => {
  const videoEl = document.getElementById('video');
  const canvasEl = document.getElementById('canvas');
  const recordEl = document.getElementById('record');
  const counterEl = document.getElementById('counter');
  const photosEl = document.querySelector('.photosContainer');
  const flashEl = document.getElementById('flash');

  serisouly = new Seriously();
  videoSrc = serisouly.source('#video');
  canvasTarget = serisouly.target('#canvas');
  effects.choose(serisouly, videoSrc, canvasTarget, 'vanilla');

  video.init(navigator, videoEl);

  recordEl.addEventListener('click', _ => {
    countdown.start(counterEl, 3, _ => {
      flash(flashEl);
      const bytes = video.captureBytesFromLiveCanvas(canvasEl);
      ipc.send('image-captured', bytes);
      photosEl.appendChild(formatImgTag(document, bytes));
    });
  });

  photosEl.addEventListener('click', evt => {
    const isRm = evt.target.classList.contains('photoClose');
    const selector = isRm ? '.photoClose' : '.photoImg';

    const photos = Array.from(document.querySelectorAll(selector));
    const index = photos.findIndex(el => el === evt.target);

    if (index > -1) {
      if (isRm) {
        ipc.send('image-remove', index);
      } else {
        shell.showItemInFolder(images.getFromCache(index));
      }
    }
  });
});

ipc.on('image-removed', (evt, index) => {
  document.getElementById('photos').removeChild(
    Array.from(document.querySelectorAll('.photo'))[index]
  );
});

ipc.on('effect-cycle', (evt) => {
  effects.cycle(serisouly, videoSrc, canvasTarget);
});

ipc.on('effect-choose', (evt, effectName) => {
  effects.choose(serisouly, videoSrc, canvasTarget, effectName);
});
