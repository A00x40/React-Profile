import { auth } from '../firebase';
import React, { Component } from 'react'

import {storage,database} from '../firebase'
import './userProfile.css'

interface MyState 
{
  displayName : string,
  phoneNumber : string,
  profile_photo :any,
  updatedName : string,
  updatedNumber: string, 
}

class UserProfile extends Component<{}, MyState> {
    constructor(props:{})
    {
      super(props);
      this.state  = { 
          displayName : '',
          phoneNumber:'', 
          profile_photo : '',
          updatedName : '',
          updatedNumber:'', 
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
              photoURL : "",
              phoneNumber: ""
            });
          }
        });
        this.editExpand();
      }
    }


    handleLogOut()
    {
      auth.signOut();
    }
  
    editExpand()
    {
      var editDisplay = document.getElementById('edit');
      if(editDisplay?.style.display === 'none')
      {
        editDisplay.style.display = 'block';
      }
      else
      {
        editDisplay!.style.display = 'none';
      }
    }

    handleChange = (event: { target: {name:any , value:any} } ) => {
      const { name , value } = event.target;

      const newState = { [name]:value } as Pick<MyState,keyof MyState>;

      this.setState(newState);
    }
    
    handleUpdate = (event:React.MouseEvent<HTMLButtonElement>) => {
      const databaseRef = database.ref(`users/${auth.currentUser!.uid}`);
      const storageRef = storage.ref(`users/${auth.currentUser!.uid}`);

      const fileList : any = document.querySelector("#photo");

      if(fileList)
      {
          const name = fileList.files[0].name;
          const metadata = {
            contentType: fileList.files[0].type
          }

          storageRef.child(name).put( fileList.files[0] , metadata)
          
          .then( (snapshot) => snapshot.ref.getDownloadURL())
          .then(url => {
            databaseRef.update( { 
              photoURL: url
            });
          })
          .catch( (err) => {
            alert(err.message);
          });
      }

      databaseRef.on('value' , (snapshot) => {
        databaseRef.update( {
            displayName : this.state.updatedName,
            phoneNumber: this.state.updatedNumber

        }).then( () => {

          this.setState( {
            displayName : snapshot.child('displayName').val(),
            profile_photo : snapshot.child('photoURL').val(),
            phoneNumber: snapshot.child('phoneNumber').val(),
            updatedName: '',
            updatedNumber: ''
          });

          this.editExpand();

        });
      });
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

          <button onClick = {this.editExpand}>Edit</button>
          <div id = "edit" >
            <div style={{textAlign: "center" , margin : "20px 10px"}}>
            <label style={{paddingRight : "10px"}}>Enter Name</label>
            <input type="text" name="updatedName" onChange={this.handleChange}/>
            </div>

            <div style={{textAlign : "center" , margin : "20px 10px"}}>
            <label style={{paddingRight : "10px"}}>Enter Phone Number</label>
            <input type="text" name="updatedNumber" onChange={this.handleChange}/>
            </div>

            <div style={{textAlign:"center"}}>
            <input type="file" style={{margin:"auto"}} id="photo"/>
            </div>
            
          </div>
            <button onClick={this.handleUpdate}>Save</button>
          
        </div>
      );
    }
}

export default UserProfile

