const constraints = {
  audio: false,
  video: {
    mandatory: {
      minWidth: 453,
      minHeight: 240,
      maxWidth: 453,
      maxHeight: 240,
    }
  }
};

function handleError(error) {
  console.error('Camera errro: ', error);
}

function handleSuccess(videoEl, stream) {
  videoEl.src = window.URL.createObjectURL(stream);
}

exports.init = (navigator, videoEl) => {
  navigator.getUserMedia = navigator.webkitGetUserMedia;
  navigator.getUserMedia(
    constraints,
    stream => handleSuccess(videoEl, stream),
    handleError
  );
}

exports.captureBytes = (videoEl, ctx, canvasEl) => {
  ctx.drawImage(videoEl, 0, 0);
  return canvasEl.toDataURL('image/png');
}