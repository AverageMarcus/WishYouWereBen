var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var image = document.querySelector('img');
var url = window.URL || window.webkitURL;

(function(){
  var videoPlaying = false;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || null;

  if(navigator.getUserMedia){
    var media = navigator.getUserMedia({video:true,audio:false}, function(stream){
      video.src = url ? url.createObjectURL(stream) : stream;
      video.play();
      videoPlaying = true;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }, function(error){
      console.log("ERROR:" + error);
    });

    document.getElementById('shutter').addEventListener('click', function(event){
      event.preventDefault();
      if (videoPlaying) {
        this.classList.add('hidden');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        var data = canvas.toDataURL('image/webp');
        image.setAttribute('src', data);

        video.classList.add('hidden');
        document.querySelector('.bens').classList.remove('hidden');
        document.getElementById('download').classList.remove('hidden');
      }
    });

    document.getElementById('download').addEventListener('click', function(event) {

      var img = document.querySelector('.floating-ben');
      var x = img.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
      var y = img.getBoundingClientRect().top - canvas.getBoundingClientRect().top;

      canvas.getContext('2d').drawImage(img, x, y);
      var data = canvas.toDataURL();

      this.href = data;
      this.download = "BenSelfie.png";
    });

    var bens = document.querySelectorAll('.bens img');
    var x = canvas.width / 2;
    var y = 20;
    for(var i=0; i<bens.length; i++) {
      bens[i].addEventListener('click', function() {

        var img = new Image();
        img.src = this.src;
        img.style.position = 'absolute';
        img.style.left = (canvas.getBoundingClientRect().left + x) + 'px';
        img.style.top = (canvas.getBoundingClientRect().top + y) + 'px';
        img.classList.add('floating-ben');
        img.setAttribute('draggable', true);

        var offsetX, offsetY;

        img.addEventListener('dragstart', function(event) {
          offsetX = event.clientX - this.getBoundingClientRect().left;
          offsetY = event.clientY - this.getBoundingClientRect().top;

          var dragImage = new Image();
          dragImage.src = this.src;
          event.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
          this.style.opacity = 0;
        });
        img.addEventListener('dragend', function(event) {
          this.style.left = (event.pageX - offsetX) + 'px';
          this.style.top = (event.pageY - offsetY) + 'px';
          this.style.opacity = 1;
        });
        document.body.appendChild(img);
      });
    }

  } else {
    console.log("Browser does not support WebCam integration");
  }
})();
