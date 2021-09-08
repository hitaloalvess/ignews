import  Head from "next/head";

import styles from './home.module.scss';

export default function Home() {
  return (
      <>
          <Head>
            <title>Ínicio | ig.news</title>
          </Head>
          <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <p> 👏 </p>
            </section>
            <img src="/images/avatar.svg" alt="avatar home" />
          </main>
      </>
  )
}
//Emoji clapping -> pegar emoji