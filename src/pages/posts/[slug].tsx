import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss';

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
                        className={styles.postContent}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps : GetServerSideProps = async({req, params}) => {

    const { slug } = params;
    const session = await getSession({req});
    
    if(!session?.activeSubscription){
        return {
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }

    const prismic = getPrismicClient(req);
    const response = await prismic.getByUID('posts', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
            day:'2-digit',
            month:'long',
            year:'numeric'
        })
    }


    return{
        props:{
            post
        }
    }
}