import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyCqh1X2NSlIdNV3I-R50M09KmHvK29j2OM",
    authDomain: "profiletask.firebaseapp.com",
    databaseURL: "https://profiletask.firebaseio.com",
    projectId: "profiletask",
    storageBucket: "profiletask.appspot.com",
    messagingSenderId: "172595398449",
    appId: "1:172595398449:web:79c943ab87e3970b595210",
    measurementId: "G-BNE41HF169"
};


firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const database = firebase.database();
export const auth = firebase.auth();

export default firebase;

