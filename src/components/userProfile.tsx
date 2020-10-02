import { auth } from '../firebase';
import React, { Component } from 'react'

import {storage,database} from '../firebase'
import './userProfile.css'

interface MyState 
{
  displayName : string,
  profile_photo : string,
  phoneNumber : string
  updatedName : string,
  updatedNumber: string, 
  uploadedPhoto?: File

}

class UserProfile extends Component<{}, MyState> {
    constructor(props:{})
    {
      super(props);
      this.state  = { 
          displayName : '',
          profile_photo : '',
          phoneNumber:'', 
          updatedName : '',
          updatedNumber:'', 
          uploadedPhoto:undefined
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
              profile_photo : "",
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
    uploadPhoto  = (event: { target: {name:any , value:any} } ) => {
      const { value } = event.target;
      const filetype = value.split('.').pop();

      const validImageTypes = ['gif', 'jpeg', 'png' , 'jpg'];
      if (validImageTypes.includes(filetype)) {
        this.setState({
          uploadedPhoto : value
        });
        
        const storageRef = storage.ref();

        console.log(value);
        //storageRef.put(value); Error Here
        
      }
      else
      {
        alert("The Uploaded File isn't an Image");
      }      
    }

    handleUpdate = (event:React.MouseEvent<HTMLButtonElement>) => {
      const databaseRef = database.ref(`users/${auth.currentUser!.uid}`);
      databaseRef.on('value' , (snapshot) => {
        databaseRef.update( {
            displayName : this.state.updatedName,
            phoneNumber: this.state.updatedNumber
        }).then( () => {
          this.setState( {
            displayName : snapshot.child('displayName').val(),
            profile_photo : snapshot.child('photoURL').val(),
            phoneNumber: snapshot.child('phoneNumber').val()
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
            <input type="file" style={{margin:"auto"}} onChange={this.uploadPhoto} />
            </div>
            
          </div>
            <button onClick={this.handleUpdate}>Save</button>
          
        </div>
      );
    }
}

export default UserProfile

