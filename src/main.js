import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = `https://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: 20,
    };

    this.handleSearchFormBoardChange = this.handleSearchFormBoardChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchFormBoardChange(e) {
    this.setState({ searchFormBoard: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.subredditSelect(this.state.searchFormBoard);
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
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    return (
      <section>
        <SearchForm
          subredditSelect = { this.subredditSelect }
        />
      </section>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditLookup: {},
      subredditSelected: null,
      subredditNameError: null,
    };
  }

  componentDidUpdate() {
    console.log('__UPDATED STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.subredditLookup) {
      try {
        const subredditLookup = JSON.parse(localStorage.subredditLookup);
        return this.setState({ subredditLookup });
      } catch (error) {
        return console.error(error);
      }
    } else {
      return superagent.get(apiUrl)
        .then((response) => {
          const subredditLookup = response.body.results.reduce((dict, result) => {
            dict[result.name] = result.url;
            return dict;
          }, {});
          try {
            localStorage.subredditLookup = JSON.stringify(subredditLookup);
            this.setState({ subredditLookup });
          } catch (error) {
            console.error(error);
          }
        })
        .catch(console.error);
    }
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
