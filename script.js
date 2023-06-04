/*
 **--------- Project19: Webcam Fun ---------**

 Goal: Manipulate the Webcam using JS in various ways
 
 */

const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

// You can set/get the video by using Web API
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;

      video.play();
    })
    .catch((err) => console.error("OH NO", err));
}

// You can set Canvas as your Video after getting it from above function
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  console.log(width, height);

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    //manipulating colors of a video in a canvas
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);

    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

//Takes your photo from a canvas and then your can download it
function takePhoto() {
  //plays the sound
  snap.currentTime = 0;
  snap.play();

  //take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  console.log(data);
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

//Manipulating with Pixels values to see some effects
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //RED
    pixels.data[i + 100] = pixels.data[i + 1]; //GREEN
    pixels.data[i - 150] = pixels.data[i + 2]; //BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
