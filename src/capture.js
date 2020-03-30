const video = require('./video');

function formatImgTag(document, bytes) {
  const div = document.createElement('div');
  div.classList.add('photo');
  const close = document.createElement('div');
  close.classList.add('photoImg');
  const img = new Image();
  img.classList.add('photoImage');
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

  const ctx = canvasEl.getContext('2d');

  video.init(navigator, videoEl);

  recordEl.addEventListener('click', _ => {
    const bytes = video.captureBytes(videoEl, ctx, canvasEl);
    photosEl.appendChild(formatImgTag(document, bytes));
  });
});
