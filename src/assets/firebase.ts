import React, { useContext } from 'react'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

export class Firebase {
    db: any
    auth: any
    storage: any
    constructor() {
        firebase.initializeApp(config)
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.storage = firebase.storage()
    }

    doUploadImage = async (file: File) => {
        const fileRef = this.storage.ref()
        const uploadTask = fileRef
            .child(`images/${file.name}`)
            .put(file)
            .then((snapshot: any) => {
                snapshot.ref.getDownloadURL().then((imageURL: string) => {
                    this.db.collection('images').add({
                        name: file.name,
                        url: imageURL,
                        place: 'Restaurant',
                        location: 'https://goo.gl/maps/DMcXyNf6BDG5EcEh7',
                    })
                })
            })
    }

    doDeleteImage = () => {
        console.log('Deleting image')
    }

    doGetImages = () => this.db.collection('images').get()

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSendEmailVerification = () => this.auth.currentUser.sendEmailVerification()

    doSignOut = () => this.auth.signOut()

    doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = (password: string) => this.auth.currentUser.updatePassword(password)

    onAuthStateChanged = (next: (user: any) => void, fallback: () => void) => {
        return this.auth.onAuthStateChanged((user: any) => {
            if (user) {
                next(user)
            } else {
                fallback()
            }
        })
    }

    user = (uid: string) => this.db.ref(`users/${uid}`)
}

export const FirebaseContext = React.createContext({} as Firebase)

export const useFirebase = (): Firebase => useContext(FirebaseContext)

export default Firebase
