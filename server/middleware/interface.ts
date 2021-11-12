export interface INewUser {
    name: string
    email: string
    password: string
  }
  
export interface IDecodedToken {
    id?: string
    newUser?: INewUser
    iat: number
    exp: number
  }
  