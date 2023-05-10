import { Component, Fragment } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import "./charInfo.scss";

// Когда в компонент приходит новый пропс, он должен перерендываться
// При смене пропса вызывается компонент componentDidUpdate

class CharInfo extends Component {
  state = {
    char: null,
    isLoading: false,
    isError: false,
  };

  marvelService = new MarvelService();

  updateChar = () => {
    const { charId } = this.props;

    if (!charId) return;

    this.onCharLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharLoaded = (char) => {
    this.setState({ char, isLoading: false });
  };

  onCharLoading = () => {
    this.setState({ isLoading: true });
  };

  onError = () => {
    this.setState({ isLoading: false, isError: true });
  };

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  render() {
    const { char, isLoading, isError } = this.state;
    const skeleton = char || isLoading || isError ? null : <Skeleton />;
    const errorMessage = isError && <ErrorMessage />;
    const spinner = isLoading && <Spinner />;
    const content = !(isLoading || isError || !char) && <View char={char} />;

    return (
      <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  return (
    <Fragment>
      <div className="char__basics">
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length === 0 && "This character doesn't have any comics"}
        {comics.slice(0, 10).map((item, i) => (
          <li key={i} className="char__comics-item">
            {item.name}
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default CharInfo;
