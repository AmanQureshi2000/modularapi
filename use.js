const {runApi} = require('./config/api.js');
const url = "https://modularapi.onrender.com/images";
const data = {
  "fileName": "forest_mist_blue.jpg",
  "fileUrl": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "mimeType": "image/jpeg",
  "fileSize": "98750"
};
const method = "POST";

runApi({url,method,data})
  .then(res => res)
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));