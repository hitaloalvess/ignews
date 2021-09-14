import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { query as q} from 'faunadb'

import { fauna } from '../../services/fauna'
import { stripe } from "../../services/stripe";

interface User{
    ref:{
        id:string
    },
    data:{
        stripe_customer_id:string
    }
}

export default async function Subscribe(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){

        const session = await getSession({req})

        const user = await fauna.query<User>( //Verifica se o usuário cadastrado já possui um customer_id
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if(!customerId){
            const stripeCustomer = await stripe.customers.create({//cria um costumer para o usuário
                email:session.user.email,
            })

            await fauna.query(//Atualiza o usuário adicionando um customer_id caso o usuário ainda não o possua
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data:{
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId ,//id do usuario que esta comprando
            payment_method_types: ['card'], //métodos de pagamentos aceito
            billing_address_collection: 'required', //Força o usuário a inserir endereço ou se deixa automatico para ser configurado dentro do stripe
            line_items: [
                { price: 'price_1JXaGIAW4xEajDas6t0nU6F3', quantity: 1}
            ], //quais itens estarao contidos dentro do carrinho 
            mode: 'subscription', //subscription pois é recorrente, cobrado a cada mês
            allow_promotion_codes: true,
            success_url:process.env.STRIPE_SUCCESS_URL,
            cancel_url:process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id})
    }else{
        res.setHeader('Allow', 'POST'); //Explica para o front-end que essa rota só aceita requisição POST
        res.status(405).end('Method not allowed'); //Método não permitido
    }
}