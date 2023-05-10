import { Component } from "react";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
  state = {
    chars: [],
    isLoading: true,
    isError: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  loadCharacters = async () => {
    this.onRequest();
  };

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  componentDidMount() {
    this.loadCharacters();
  }

  onCharsLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, chars }) => ({
      chars: [...chars, ...newCharList],
      isLoading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({ isError: true });
  };

  renderItems = (chars) => {
    return (
      <ul className="char__grid">
        {chars.map((char) => (
          <li
            onClick={() => this.props.onCharSelect(char.id)}
            key={char.id}
            className="char__item"
          >
            <img src={char.thumbnail} alt="abyss" />
            <div className="char__name">{char.name}</div>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { chars, isLoading, isError, newItemLoading, offset, charEnded } =
      this.state;
    const items = this.renderItems(chars);
    const error = isError && <ErrorMessage />;
    const loading = isLoading && <Spinner />;
    const content = !(isError || isLoading) && items;

    return (
      <div className="char__list">
        {error}
        {content}
        {loading}
        <button
          style={{ display: charEnded ? "none" : "block" }}
          disabled={newItemLoading}
          onClick={() => this.onRequest(offset)}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
