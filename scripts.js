// Selectors
const searchInput = document.querySelector('.search-input');
const serachButton = document.querySelector('.search-button');
const lyricsList = document.querySelector('.lyrics-list');
const spinner = document.getElementById('spinner');

// Event Listeners
serachButton.addEventListener('click', searchLyrics);

// Functions
function getLyrics() {}

function lyricItem(data) {
  // Create new Li
  const newLyrics = document.createElement('li');

  // Create new info i.e p tag
  const lyricsInfo = document.createElement('p');
  lyricsInfo.innerHTML = `<strong>${data.artist}</strong> - ${data.title}`;

  newLyrics.appendChild(lyricsInfo);

  // Create new view link i.e a tag
  const lyricsView = document.createElement('a');
  lyricsView.classList.add('btn', 'btn-primary', 'js-open-modal');

  // Add custom data attributes
  lyricsView.setAttribute('data-artist', data.artist);
  lyricsView.setAttribute('data-title', data.title);
  lyricsView.setAttribute('data-modal', '1');
  lyricsView.innerText = 'Show Lyrics';

  newLyrics.appendChild(lyricsView);

  return newLyrics;
}

function generateLyricsList(data) {
  if (data.length > 0) {
    data.map((item) => {
      let lyricData = {
        artist: item.artist.name,
        title: item.title,
      };
      lyricsList.append(lyricItem(lyricData));
    });
  } else {
    return '';
  }
}
function searchLyrics(event) {
  event.preventDefault();

  // Get the search value
  let searchQuery = searchInput.value;

  searchQuery = searchQuery.trim();
  // url encode the search query
  searchQuery = encodeURI(searchQuery);

  // avoid search for empty string
  if (!searchQuery) {
    return false;
  }
  // Empty the previous List
  lyricsList.innerHTML = '';

  spinner.removeAttribute('hidden');
  // Hit the api
  fetch(`https://api.lyrics.ovh/suggest/${searchQuery}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // This is the JSON from our response
      generateLyricsList(data.data);
      spinner.setAttribute('hidden', '');
    })
    .catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
      spinner.setAttribute('hidden', '');
    });
}

/* Overlay */
document.addEventListener('DOMContentLoaded', function () {
  var modalButtons = document.querySelectorAll('.js-open-modal'),
    overlay = document.querySelector('.js-overlay-modal'),
    closeButtons = document.querySelectorAll('.js-modal-close');

  modalButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      var modalId = this.getAttribute('data-modal'),
        modalElem = document.querySelector(
          '.modal[data-modal="' + modalId + '"]'
        );
      // Call to my function
      getLyrics();
      modalElem.classList.add('active');
      overlay.classList.add('active');
    }); // end click
  });

  closeButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var parentModal = this.closest('.modal');

      parentModal.classList.remove('active');
      overlay.classList.remove('active');
    });
  });

  document.body.addEventListener(
    'keyup',
    function (e) {
      var key = e.keyCode;

      if (key == 27) {
        document.querySelector('.modal.active').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
      }
    },
    false
  );

  overlay.addEventListener('click', function () {
    document.querySelector('.modal.active').classList.remove('active');
    this.classList.remove('active');
  });
});

// overlay end
