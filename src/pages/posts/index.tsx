import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { GetStaticProps } from "next";


import Head from "next/head";

import { getPrismicClient } from "../../services/prismic";

type Post = {
    slug:string;
    title:string;
    excerpt:string;
    updateAt: string;
}
interface PostsProps{
    posts1: Post[]
}

import styles from './styles.module.scss';
export default function Posts({ posts1 } : PostsProps){
    return(
        <>
            <Head>
                <title>Posts | ig.news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.post}>
                    {   posts1.map( post => (
                            <a key={post.slug} href="#" >
                                <time>{post.updateAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        ))
                    }
                </div>
            </main>
        </>
        
    )
}

export const getStaticProps: GetStaticProps = async() => {
    const prismic = getPrismicClient()

    const response = await prismic.query(
        [ Prismic.predicates.at('document.type', 'posts')],
        {
            fetch:['posts.title', 'posts.content'],
            pageSize: 100
        }
    )

    const posts1 = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',//Percorre o array de content até encontrar um paragrafo, caso não tenha paragrafo retorna uma string vazia
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                day:'2-digit',
                month:'long',
                year:'numeric'
            })
        };
    })

    console.log(posts1)
    return {
        props:{
            posts1
        }
    }
}