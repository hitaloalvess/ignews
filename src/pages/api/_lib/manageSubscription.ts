import { query as q } from 'faunadb'
import { useRef } from 'react';
import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createdAction = false
){
    // 1- Buscar o usuário no faunadb com o customerId
    
    const userRef = await fauna.query(
        q.Select(
            'ref',
            q.Get(
                q.Match(
                    'user_by_stripe_customer_id',
                    customerId
                )
            )
        )
    )
            
    // 2- Salvar a subscription no faunadb
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }       
    
    if(createdAction){
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    }else{
        await fauna.query(
            q.Replace( //Replace é parecido com o Update, a diferença é que o Update pode atualizar um campo por vez, enquanto o Replace altera todo o registro
                q.Select(
                    'ref',
                    q.Get(
                        q.Match(
                           q.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}