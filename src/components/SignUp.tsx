import React, { ChangeEvent, Component, FormEvent } from 'react'
import './Form.css';
import {auth} from '../firebase';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface MyState {
    email:string,
    password:string,
}

class SignUp extends Component<RouteComponentProps, MyState> {
    constructor(props: RouteComponentProps)
    {
        super(props);
        this.state = {
            email:'',
            password:'',
        };
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Sign Up Clicked");

        const {email , password} = this.state;
 
        auth.createUserWithEmailAndPassword(email,password)
        .then( () => {
            this.props.history.push('/');
        })
        .catch(err => {
            alert(err.message);
        });
    }

    changeHandler = (event: ChangeEvent<HTMLInputElement> ) => {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]:value } as Pick<MyState,keyof MyState>); 
    }

    render(){
        return (
            <div className="SignIn-SignUp"> 
                <h1>Sign Up</h1>
            ``  <div className="form">              
                    <form onSubmit={this.handleSubmit} className="in-form">
                        <input type="text" onChange={this.changeHandler} name="email" placeholder="email"/>
                        <input type="password" onChange={this.changeHandler} name="password" placeholder="password"/>
                        <button>create</button>
                    </form>
                </div>
            </div>
        );
    }
}
   

export default  withRouter(SignUp)
