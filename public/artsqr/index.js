var muteUnmuteBtn = document.getElementById('muteUnmuteBtn');
muteUnmuteBtn.addEventListener('click', toggleMute);

function toggleMute(e) {
    var target = e.target;
    var targetVideoId = target.getAttribute('data-target');
    var targetVideo = document.getElementById(targetVideoId);
    if (targetVideo.muted) {
        target.classList.remove('muted');
        target.classList.add('unmuted');
    } else {
        target.classList.add('muted');
        target.classList.remove('unmuted');
    }
    targetVideo.muted = !targetVideo.muted;
}