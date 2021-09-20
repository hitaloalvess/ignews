import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from 'next/link'
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss';

type Post = {
    slug:string;
    title:string;
    content:string;
    updateAt: string;
}
interface PostProps{
    post: Post;
}

export default function Post({post} : PostProps){

    const router = useRouter();
    const [session] = useSession();

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)       
        }
    },[session])

    return(
        <>
            <Head>
                <title>{`${post.slug} | ig.news`}</title>
            </Head>
            <main className={styles.postContainer}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div 
                        dangerouslySetInnerHTML={{ __html: post.content}} 
                        className={`${styles.postContent} ${styles.previewContent}`}
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href='/'>
                            <a>Subscribe now 😃</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths : GetStaticPaths = () => {
    return{
        paths:[],
        fallback: 'blocking',
    }
}


export const getStaticProps : GetStaticProps = async({ params}) => {

    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('posts', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
            day:'2-digit',
            month:'long',
            year:'numeric'
        })
    }


    return{
        props:{
            post
        },
        revalidate: 60 * 30,
    }
}