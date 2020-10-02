import React, { Component } from 'react'
import './Form.css';
import {auth} from '../firebase';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface MyState {
    email:string,
    password:string,
}

class Login extends Component<RouteComponentProps, MyState> {
    constructor(props: RouteComponentProps)
    {
        super(props);
        this.state = {
            email:'',
            password:'',
        };
    }

    submitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        // sign in email & password check
        // If success LoggedIn state changes and App renders Profile
        auth.signInWithEmailAndPassword(this.state.email,this.state.password)
        .catch(err => {
            alert(err.message);
        });
    }

    handleChange = (event: { target: {name:any , value:any} } ) => {
        const { name , value } = event.target;

        const newState = { [name]:value } as Pick<MyState,keyof MyState>;

        this.setState(newState);
    }

    render(){
        return (
            <div className="SignIn-SignUp"> 
                <h1>Login</h1>
            ``  <div className="form">              
                    <form  className="in-form">
                        <input type="text" onChange={this.handleChange} name="email" placeholder="email"/>
                        <input type="password" onChange={this.handleChange} name="password" placeholder="password"/>
                        <button onClick={this.submitHandler}>login</button>
                    </form>
                </div>
            </div>
        );
    }
}
   

export default  withRouter(Login)




  
    
