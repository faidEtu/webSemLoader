
var films_tab = [];


function openFileInput() {
  document.querySelector('#csv').click();
}

function load() {

  let csvData = '';

  let fileReader = new FileReader();

  fileReader.onload = (e) => { csvToJs(fileReader.result); }
  fileReader.readAsText(document.querySelector('#csv').files[0], 'windows-1252');
}

function csvToJs(csvData) {

  let result = "OK";

  const filmsData = csvData.split('\n');

  let filmsTab = [];
  const nbFilms = filmsData.length - 1;

  for (let i = 1; i < nbFilms; i++) { // 1 bceause the 1st line contain cols label
    let filmData = filmsData[i].split(';');
    filmsTab.push({
      id: slugg(filmData[0]),
      titre: filmData[0],
      annee: filmData[2]
    });
  }
  films_tab = filmsTab;
  displayFilmsTab();

  return result;
}

function displayFilmsTab() {

  let html = '';

  for (let film of films_tab) {
    html += `<tr> <td>${film.titre}</td> <td>${film.annee}</td> <td id="statut-film-${film.id}"></td> </tr>`;
  }

  document.querySelector('#film-tab').innerHTML = '<tbody>' + html + '</tbody>';
}

function fusekiInsert() {

  const db = document.querySelector('#db').value;

  const fuseqiBdUrl = 'http://localhost:3030/' + db + '/update';
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest"
  });

  for (const film of films_tab) {
    const query = encodeURIComponent(`
      PREFIX : <http://www.semanticweb.org/nathalie/ontologies/2017/1/untitled-ontology-161/instances#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      INSERT {
        :${film.id} a ?classfilm.
        :${film.id} rdfs:label "${film.titre}"@fr.
        :${film.id} rdfs:year "${film.annee}".
      }
      WHERE {
        ?classfilm rdfs:label "film"@fr.
      }`
    );

    window.fetch(fuseqiBdUrl + "?update=" + query, { method: 'POST', headers: headers })
      .then((response) => {
        if (response.status >= 400)
          document.querySelector('#statut-film-' + film.id).textContent = 'ERREUR';
        else
          document.querySelector('#statut-film-' + film.id).textContent = 'OK';
      })
      .catch((err) => {
      });
  }
}
