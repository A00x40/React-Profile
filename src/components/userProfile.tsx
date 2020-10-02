import { auth } from '../firebase';
import React, { Component } from 'react'

import {storage,database} from '../firebase'
import './userProfile.css'

interface MyState 
{
  displayName : string,
  profile_photo : string,
  phoneNumber : string

}
class UserProfile extends Component<{}, MyState> {
    constructor(props:{})
    {
      super(props);
      this.state  = { 
          displayName : '',
          profile_photo : '',
          phoneNumber:'', 
      };
    } 

    componentDidMount()
    {
      if(auth.currentUser)
      {
        this.setState( {
          displayName : auth.currentUser.displayName!,
          profile_photo : auth.currentUser.photoURL!,
          phoneNumber: auth.currentUser.phoneNumber!
        })
      }
    }


    handleLogOut()
    {
      auth.signOut();
    }
  
    render() {
      const { displayName , profile_photo , phoneNumber} = this.state;
  
      return (
        <div>
          <h1>Profile</h1>
          <div className = "image"
            style={{
              background: `url(${profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gnome-stock_person.svg/1024px-Gnome-stock_person.svg.png'})  no-repeat center center`,
              backgroundSize: "cover",
              height: "200px",
              width: "200px"
            }}
          ></div>

          <div className="usrdata">
            <h2>{displayName}</h2>
            <h3>{phoneNumber}</h3>
          </div>
          <button onClick = {this.handleLogOut}>Sign out</button>
        </div>
      );
    }
}

export default UserProfile

