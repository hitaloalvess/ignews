import { NextApiRequest, NextApiResponse} from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'

import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manageSubscription';
//converte Readable em um objeto de requisição
async function buffer(readable : Readable){
    const chuncks = [];

    for await (const chunck of readable){
        chuncks.push(
            typeof chunck === 'string' ? Buffer.from(chunck) : chunck
        );
    }

    return Buffer.concat(chuncks);
    //Basicamente pega todos os pedaços da requisição e os junto em um array, no final concatena tudo e retorna um Buffer
}

//Por padrão o Next entende que toda requisição vem como JSON ou FormData, etc
//config modifica o entendimento do Next em relação ao formato dos dados recebidos por requisições
//Isso é necessário pois estamos recebendo dados do tipo Readable
export const config ={ 
    api: {
        bodyParser: false
    }
}

const relevantsEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.update',
    'customer.subscription.deleted',

])

export default async (req : NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST'){
        const buf = await buffer(req);//contém todos os dados da requisição
        const secret = req.headers['stripe-signature']
        let event: Stripe.Event;

        try{
            //Se secret for igual a process.env... então quer dizer que os dados estão vindos do stripe, assim o event é validado e inserido dentro de event
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
            
        }catch(error){
            console.log(error);
            return res.status(400).json(`Webhook error: ${error.message}`)
        }

        const { type }  = event;

        if(relevantsEvents.has(type)){//Se o evento for relevante, escuta e executa uma ação para cada evento
           try{

                switch(type){
                    case 'customer.subscription.update':
                    case 'customer.subscription.deleted':
                    
                        const subscription = event.data.object as Stripe.Subscription

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )

                    break;
                    
                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )

                    break;
    
                    default:
                        throw new Error('Unhandled event.');
                }

           }catch(error){
                return res.json({error:'Webhook handler failed.'});
           }
        }

        res.json({ received:true});
    }else{
        res.setHeader('Allow', 'POST'); //Explica para o front-end que essa rota só aceita requisição POST
        res.status(405).end('Method not allowed'); //Método não permitido
    }
    
}

//Os dados vindos através dos Webhooks vem em um formato de stream (Readable), portanto é necessário a utilização da function buffer para transformar esse Readable em um objeto que possa ser interpretado pelo javascript
