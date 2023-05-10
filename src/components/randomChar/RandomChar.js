import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

class RandomChar extends Component {
  constructor(props) {
    super(props);
  }
  // Публичные поля классов
  // Свойство state теперь лаконично объявлено в начале класса.
  // Нам больше не нужен конструктор только для того, чтобы определить некоторые поля.
  state = {
    char: {},
    isLoading: true,
    isError: false,
  };

  marvelService = new MarvelService();

  onCharLoaded = (char) => {
    this.setState({ char, isLoading: false });
  };

  onCharLoading = () => {
    this.setState({ isLoading: true });
  };

  onError = () => {
    this.setState({ isLoading: false, isError: true });
  };

  updateChar = async () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.onCharLoading();
    // По умолчанию в целопчку then приходит аргумент, и если мы передаем внутрь функцию
    // то аргумент будет автоматически подставлен в функцию this.onCharLoaded
    await this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  componentDidMount() {
    this.updateChar();
  }

  render() {
    const { char, isLoading, isError } = this.state;
    const errorMessage = isError && <ErrorMessage />;
    const spinner = isLoading && <Spinner />;
    const content = !(isLoading || isError) && <View char={char} />;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main">
            <div onClick={this.updateChar} className="inner">
              try it
            </div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {!description && "There is no description about this character"}
          {description?.length > 170
            ? `${description.slice(0, 220)}...`
            : description}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
