import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { REDIRECT_URI } = process.env
const { CLIENT_ID } = process.env

const AuthContext = createContext({} as IAuthContextData)

interface AuthProviderProps{
  children: ReactNode
}

interface User{
  id: string;
  name: string;
  email: string;
  photo?: string
}

interface IAuthContextData{
  user: User,
  signInWithGoogle(): Promise<void>
  signInWithApple(): Promise<void>
  signOut(): void
  userStorageDataLoading: boolean
}
interface AuthorizationResponse{
  params:{
    access_token: string;

  }
  type: string
}

function AuthProvider({ children }: AuthProviderProps){
 const [user, setUser] = useState<User>({} as User);
 const [userStorageDataLoading, setUserStorageDataLoading] = useState(true);

 const userStorageKey = '@gofinances:user'

 useEffect(()=>{
  async function loadUserStorageDate(){
    const userStorage = await AsyncStorage.getItem(userStorageKey)
    if(userStorage){
      const userLogged= JSON.parse(userStorage) as User;
      setUser(userLogged)
    }
    setUserStorageDataLoading(false)
  }
  loadUserStorageDate()

  return ()=> new AbortController().abort()
 },[])

  async function signInWithGoogle(){
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}` 

      const { type, params } = await AuthSession
      .startAsync({
        authUrl
      }) as AuthorizationResponse

      if (type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json()

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        })
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userInfo))
      }
    } catch (error: any) {
        throw new Error(error)
    }

  }

  async function signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes:[
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      })

      if(credential){
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name: credential.fullName?.givenName!,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName?.givenName}&length=1`
        }

        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
      }

      

    } catch (error: any) {
      throw new Error(error) 
    }
  }

async function signOut(){
  setUser({} as User)
  await AsyncStorage.removeItem(userStorageKey)
}

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      userStorageDataLoading,
      signOut
    }}>
          {children}
        </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext)

  return context
}

export {
  AuthProvider,
  useAuth
}