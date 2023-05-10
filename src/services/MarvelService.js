class MarvelService {
  _apiKey = "92b2e41a0cfeaadfea113bc7ff06df96";
  _apiBase = "https://gateway.marvel.com:443/v1/public";
  _baseOffset = 1550;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Couldn't not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}/characters?limit=9&offset=${offset}}&apikey=${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}/characters/${id}?apikey=${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  // Lodash shows other programmers that it better to not change function name.
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
