import { GetStaticProps } from "next";

import  Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from './home.module.scss';

interface HomeProps{
  product:{
    productId:string;
    amount:number
  }
}

export default function Home({product} : HomeProps) {
  return (
      <>
          <Head>
            <title>Ínicio | ig.news</title>
          </Head>
          <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <p> 👏 Hey, welcome </p>
                <h1>News about <br /> the <span>React</span> world</h1>
                <p>Get acess to all the publications <br /> <span>for { new Intl.NumberFormat('en-US', {
                  style:'currency',
                  currency:'USD'
                }).format(product.amount / 100)} month</span></p>

                <SubscribeButton productId={product.productId} />
            </section>
            <img className={styles.mulher} src="/images/avatar.svg" alt="avatar home" />
          </main>
      </>
  )
}

export const getStaticProps : GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1JXaGIAW4xEajDas6t0nU6F3',{
    expand:['product']
  })

  const product = {
    productId: price.id,
    amount: price.unit_amount
  }

  return{
    props:{
      product
    },
    revalidate: 60 * 60 * 24, //24 horas
  }
}