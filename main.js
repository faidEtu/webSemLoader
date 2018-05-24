
var FILMS = [];
var ACTORS_FILMS = [];


function openFileInput() {
  document.querySelector('#csv').click();
}

function load() {

  let csvData = '';

  let fileReader = new FileReader();

  fileReader.onload = (e) => {
    getFilmMainsInfos(fileReader.result);
    displayFilmsTab();
    getFilmsSecondaryInfos()
  }
  fileReader.readAsText(document.querySelector('#csv').files[0], 'windows-1252');
}

function getFilmMainsInfos(csvData) {

  FILMS = [];

  const filmsData = csvData.split('\n');

  const nbFilms = filmsData.length - 1;
  const csvColumns = filmsData[0].split(';').map(column => column.trim());
  const nbColumns = csvColumns.length;

  for (let i = 1; i < nbFilms; i++) { // 1 bceause the 1st line contain cols label
    let filmRawData_ = filmsData[i].split(';');
    let filmRawData = {};
    for (let j = 0; j < nbColumns; j++) {
      filmRawData[csvColumns[j]] = filmRawData_[j];
    }
    let filmData = {
      id: slugg(filmRawData['Titre']),
      titre: filmRawData['Titre'],
      annee: filmRawData['année'] || filmRawData['Année de tournage'] || '',
      realisateur: filmRawData['Réalisé par'] || filmRawData['Réalisateur'] || '',
      sortie: filmRawData['Date de sortie']
    };
    FILMS.push(filmData);
  }
}

function getFilmsSecondaryInfos() {

  ACTORS_FILMS = [];

  for (let film of FILMS) {
    window.fetch('http://www.omdbapi.com/?apikey=342c17cd&type=movie&t=' + encodeURI(film.titre))
      .then((response) => { return response.json() })
      .then((data) => {
        if (data.Actors) {
          let filmActors = data.Actors.split(', ');
          for (let actor of filmActors) {
            ACTORS_FILMS.push({
              actorId: slugg(actor),
              actor: actor,
              filmId: film.id
            });
          }
          document.querySelector('#film-acteurs-' + film.id).textContent = data.Actors;
        }
      });
  }
}

function displayFilmsTab() {

  let html = '';

  for (let film of FILMS) {
    html += `<tr> 
      <td>${film.titre}</td> 
      <td>${film.annee}</td> 
      <td>${film.sortie}</td> 
      <td>${film.realisateur}</td> 
      <td id="film-acteurs-${film.id}"></td> 
      <td id="film-statut-${film.id}"></td> 
      </tr>`;
  }

  document.querySelector('#film-tab').innerHTML = '<tbody>' + html + '</tbody>';
}
