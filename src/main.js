import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: '',
    };

    this.handleSearchFormBoardChange = this.handleSearchFormBoardChange.bind(this);
    this.handleSearchFormLimitChange = this.handleSearchFormLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchFormBoardChange(e) {
    this.setState({ searchFormBoard: e.target.value });
  }

  handleSearchFormLimitChange(e) {
    this.setState({ searchFormLimit: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.subredditSelect(this.state.searchFormBoard, this.state.searchFormLimit);
  }

  render() {
    return (
      <form onSubmit = { this.handleSubmit }>
        <input 
          type = 'text'
          name = 'subredditName'
          placeholder = 'Search for a subreddit'
          value = { this.state.searchFormBoard }
          onChange = { this.handleSearchFormBoardChange }
        />
        <input 
          type = 'number'
          name = 'limitResults'
          placeholder = 'Limit results'
          value = { this.status.searchFormLimit }
          onChange = { this.handleSearchFormLimitChange }
          min = '0'
          max = '100'
        />
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.renderResultList = this.renderResultList.bind(this);
  }

  renderResultList(results) {
    return (
      <ul>
        { results.map((result, index) => {
          return (
            <a href = { result.url } key = { index }><li> { result.title } </li></a>
          );
        })}
      </ul>
    );
  }
  render() {
    return (
      <section>
        <h2>Search Results:</h2>
        { this.renderResultList(this.props.searchResults) }
      </section>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultList: [],
      // subredditSelected: null,
      // subredditNameError: null,
    };
    this.searchReddit = this.searchReddit.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATED STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.searchResults) {
      try {
        const searchResults = JSON.parse(localStorage.searchResults);
        return this.setState({ resultList: searchResults });
      } catch (error) {
        return console.error(error);
      }
    } else {
      return undefined;
    }
  }

  searchReddit(searchFormBoard, searchFormLimit) {
    return superagent.get(`https://www.reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`)
      .then((response) => {
        const searchResults = [];
        response.body.data.children.map((result) => {
          return searchResults.push({
            title: result.data.title,
            url: result.data.url,
          });
        });
        try {
          localStorage.searchResults = JSON.stringify(searchResults);
          this.setState({ resultList: searchResults });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <header>
          <h1>Lab 27: Reddit Search</h1>
        </header>
        <SearchForm subredditSelect = { this.searchReddit} />
        <SearchResultList searchResults = { this.state.resultList }/>
      </div>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
