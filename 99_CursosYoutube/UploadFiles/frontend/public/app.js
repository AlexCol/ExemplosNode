//!global consts
const API_URL = 'http://localhost:3000';
const ON_UPLOAD_EVENT = 'file-uploaded';

//!global variables
let bytesAmount = 0;

//!helpers
const updateStatus = (size) => {
  const sizeText = formatBytes(size);
  const text = `Pending Bytes to Upload: <strong>${sizeText}</strong>`;
  document.getElementById("size").innerHTML = text;
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//!windows methods
const onload = () => {
  const ioClient = io.connect(API_URL, { withCredentials: false });
  ioClient.on("connect", (data) => {
    console.log("Connected to server");
  });

  ioClient.on(ON_UPLOAD_EVENT, (bytesReceived) => {
    console.log(`Received event ${ON_UPLOAD_EVENT}: ${bytesReceived}`);
    bytesAmount = bytesAmount - bytesReceived;
    updateStatus(bytesAmount);
  });

  updateStatus(0);
};

const showSize = () => {
  const fileEmement = document.getElementById("files").files;
  if (!fileEmement) return;

  const files = Array.from(fileEmement);
  if (files.length === 0) return;

  const size = files.reduce((acc, file) => acc + file.size, 0);
  bytesAmount = size;
  updateStatus(bytesAmount);

  // const interval = setInterval(() => {
  //   if (bytesAmount <= 0) {
  //     clearInterval(interval);
  //     return;
  //   }
  //   bytesAmount -= 5e6;
  //   if (bytesAmount < 0) bytesAmount = 0;
  //   updateStatus(bytesAmount);
  // }, 50);
}

window.onload = onload;
window.showSize = showSize;