
function fusekiInsert() {
  fusekiInsertFilms(FILMS);
  fusekiInsertActors(ACTORS_FILMS)
}

function fusekiInsertFilms(films) {

  const db = document.querySelector('#db').value;

  const fuseqiBdUrl = 'http://localhost:3030/' + db + '/update';
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest"
  });

  for (let film of films) {
    const query = encodeURIComponent(`
      PREFIX : <http://www.semanticweb.org/nathalie/ontologies/2017/1/untitled-ontology-161/instances#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX imdb: <http://data.linkimdb.org/ressource/movie#>

      INSERT {
        :${film.id} a ?classfilm.
        :${film.id} rdfs:label "${film.titre}"@fr.
        :${film.id} rdfs:year "${film.annee}".
        :${film.id} imdb:DateOfRelease "${film.sortie}".
        :${film.id} imdb:nameOfPerson "${film.realisateur}".
      }
      WHERE {
        ?classfilm rdfs:label "film"@fr.
      }`
    );

    window.fetch(fuseqiBdUrl + "?update=" + query, { method: 'POST', headers: headers })
      .then((response) => {
        if (response.status >= 400)
          document.querySelector('#film-statut-' + film.id).textContent = 'ERREUR';
        else
          document.querySelector('#film-statut-' + film.id).textContent = 'OK';
      })
      .catch((err) => {
      });
  }
}

function fusekiInsertActors(actors) {

  const db = document.querySelector('#db').value;

  const fuseqiBdUrl = 'http://localhost:3030/' + db + '/update';
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest"
  });

  for (let actor of actors) {
    const query = encodeURIComponent(`
      PREFIX : <http://www.semanticweb.org/nathalie/ontologies/2017/1/untitled-ontology-161/instances#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      INSERT {
        :${actor.actorId} a ?classPersonne.
        :${actor.actorId} rdfs:label "${actor.actor}"@fr.
        :${actor.actorId} :aJoueDans :${actor.filmId}.
      }
      WHERE {
        ?classPersonne rdfs:label "personne"@fr.
      }`
    );

    window.fetch(fuseqiBdUrl + "?update=" + query, { method: 'POST', headers: headers })
      .then((response) => {
        if (response.status >= 400)
          document.querySelector('#film-statut-' + film.id).textContent = 'ERREUR';
        else
          document.querySelector('#film-statut-' + film.id).textContent = 'OK';
      })
      .catch((err) => {
      });
  }
}