import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, RouteHandler } from 'react-router'
import { createStore } from 'redux'

var userReducer = function(state, action) {
        if(state === undefined) {
            state = [];
        }
        if(action.type === 'ADD_USER') {
            state = state.concat(action.user);
            console.log(state);
        }
        return state;
};

var userStore = createStore(userReducer);

var Home = React.createClass({
    render: function() {
        return (<div>
                <p>Welcome to the Home Page...</p>
              </div>);
    }
});

class Users extends React.Component {
  constructor(props) {
   super(props);
   this.state = {list:[]};
  }

  componentDidMount() {
    var self = this;

    $.getJSON('/data.json').done(function (data) {
        var tmpList = data.list.concat(userStore.getState());
        self.setState({
            list: tmpList
        });
    });

    userStore.subscribe(function() {
        $.getJSON('/data.json').done(function (data) {
            var tmpList = data.list.concat(userStore.getState());
            self.setState({
                list: tmpList
            });
        });
   });

  }

  render() {
    var self = this;
    var list = this.state.list;
    return (
            <div>
              <ul>
              {list.map(function(item, i) {
                  return <li><Link to={`/users/${i}`}>{item.name}</Link> - {item.email}</li>
              })}
              </ul>
              <CreateUser/>
            </div>
    );
  }
}

var UsersDetail = React.createClass({
    render: function() {
      var id = this.props.params.id;
      var userDetail = userList[id] || {name:'',email:''};
        return (
                <div>
                  <div>name: {userDetail.name}</div>
                  <div>email: {userDetail.email}</div>
                </div>
        );
  }
});

var DannyDetail = React.createClass({
    render: function() {
        var Danny = {
            first: "Danny",
            last: "King"
        };
        return (
            <div>
                <div>first name: {Danny.first}</div>
                <div>last name: {Danny.last}</div>
            </div>
        );
    }
});

var CreateUser = React.createClass({

    getInitialState: function() {
        return {
            createForm: {
                name: '',
                email: ''
            }
        };
    },

    formSubmitted: function() {
        console.log(this.state.createForm);

        userStore.dispatch({
            type: 'ADD_USER',
            user: this.state.createForm
        });
        this.setState({
            createForm: {
                name: '',
                email: ''
            }
        });
    },

    handleNameChange: function(event) {
        this.setState({
            createForm: {
                name: event.target.value,
                email: this.state.createForm.email
            }
        });
    },

    handleEmailChange: function(event) {
        this.setState({
            createForm: {
                name: this.state.createForm.name,
                email: event.target.value
            }
        });
    },

    render: function() {
        return( <div>
                    <label text="Name"/>
                    <input
                        ref={(c) => this._usernameInput = c}
                        type="text"
                        value={this.state.createForm.name}
                        onChange={this.handleNameChange}
                    />
                    <br/>
                    <label text="Email"/>
                    <input
                        ref={(c) => this._emailInput = c}
                        type="text"
                        value={this.state.createForm.email}
                        onChange={this.handleEmailChange}
                    />
                    <br/>
                    <input
                        type="button"
                        value="Submit!"
                        onClick={this.formSubmitted}
                    />

                </div>);
    }
});

var MainLayout = React.createClass({
    render: function() {
        return (<div>
                  <span>Header:</span>
                  <Link to="/">Home</Link> |
                  <Link to="/users">Users</Link> |
                  <Link to="/danny">Danny</Link> |
                  <Link to="/create">Create User</Link>
                  <hr/>
                  <div>
                    <h2>Body Content</h2>
                  {this.props.children}
                  </div>
                  <div><hr/>footer</div>
                </div>);
    }
});

ReactDOM.render((
  <Router>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />
      <Route path="/users" component={Users} />
      <Route path="/users/:id" component={UsersDetail} />
      <Route path="/danny" component={DannyDetail} />
      <Route path="/create" component={CreateUser} />
    </Route>
  </Router>
), document.getElementById('app'));
