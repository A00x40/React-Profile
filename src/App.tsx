import React, { Component } from 'react'

import { BrowserRouter, Switch , Route } from 'react-router-dom';

import {auth} from './firebase'

import SignUp from './components/SignUp'
import Login from './components/Login';
import UserProfile from './components/userProfile';

interface MyState {
  isLogged:boolean
}

class App extends Component<{},MyState> {
    constructor(props:{})
    {
      super(props);

      //boolean to render Profile if true - SignIn/SignUp if false
      this.state = {
        isLogged:false
      }
    }

    componentDidMount()
    {
      //Listener to signIn state
      auth.onAuthStateChanged((userAuth) => {
        if(userAuth)
        {
          this.setState({isLogged:true});
        }
        else
        {
          this.setState({isLogged:false});
        }
      });
    }
    render(){
      var {isLogged} = this.state;
      const conditionalRender = () => {
        if(isLogged)
        {
          return (
            <UserProfile />
          )
        }
        else
        {
          return (
            <BrowserRouter>
              <Switch>
                <Route path="/" exact>
                  <Login/>
                </Route>

                <Route path="/signup" exact>
                  <SignUp/>
                </Route>
              </Switch>   
            </BrowserRouter>
          );
        }
      }
      return (
          <div className="App">
            {conditionalRender()}
          </div>
      );
    }
}
   
export default App




  
    

