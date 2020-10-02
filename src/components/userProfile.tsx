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
        const databaseRef = database.ref(`users/${auth.currentUser.uid}`);
        databaseRef.on('value' , (snapshot) => {
          //If user exists in database get his data
          if(snapshot.hasChildren())
          {
            console.log(snapshot.ref);
            
            this.setState( {
              displayName : snapshot.child('displayName').val(),
              profile_photo : snapshot.child('photoURL').val(),
              phoneNumber: snapshot.child('phoneNumber').val()
            });
          }

          //Else Add new user to the database
          else
          {
            databaseRef.set( {
              displayName : "Press Edit to Update",
              profile_photo : "",
              phoneNumber: ""
            });
          }
          
        });
      }
    }


    handleLogOut()
    {
      auth.signOut();
    }
  
    render() {
      const { displayName , profile_photo , phoneNumber} = this.state;
  
      return (
        <div id="profilePage">
          <h1>Profile Details</h1>
          <div className = "image"
            style={{
              background: `url(${profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gnome-stock_person.svg/1024px-Gnome-stock_person.svg.png'})  no-repeat center center`,
              backgroundSize: "cover",
              height: "300px",
              width: "300px",
              margin:"auto"
            }}
          ></div>

          <div className="userdata">
            <h2>Name : {displayName}</h2>
            <h3>Phone Number : {phoneNumber}</h3>
          </div>
          <button onClick = {this.handleLogOut}>Sign out</button>
        </div>
      );
    }
}

export default UserProfile

