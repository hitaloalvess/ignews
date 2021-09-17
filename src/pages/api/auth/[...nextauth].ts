import { query as q} from 'faunadb'

import NextAuth from "next-auth"
import { session } from 'next-auth/client'
import Providers from "next-auth/providers"

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope:'read:user'
    }),
  ],
  jwt:{
    signingKey: process.env.SIGNIN_KEY
  },
  callbacks:{
    async session(session){ // permite modificar os dados da session ( utilizados atraves do getSession )

      try{
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )
  
        return { 
          ...session,
          activeSubscription : userActiveSubscription
        };
      }catch{
        return { 
          ...session,
          activeSubscription : null
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;
      try{

        await fauna.query(
          q.If( // QUERY =  SE NÃO EXISTE UM USUÁRIO POR E-MAIL IGUAL A (user.email) -> Crie um registro SE NÃO -> pegue os seus dados
            q.Not( 
              q.Exists( 
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data : { email }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true;
      }catch(error){
        console.log(error)
        return false;
      }

    },
  }
})