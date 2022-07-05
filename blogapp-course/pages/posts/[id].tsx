import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Storage } from 'aws-amplify'
import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkDown from 'react-markdown'
import '../../configureAmplify'
import { GetPostQuery, ListPostsQuery, Post } from '../../src/API'
import { getPost, listPosts } from '../../src/graphql/queries'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Post: NextPage<Props> = ({ post }) => {
  const [coverImage, setCoverImage] = useState<string | null>(null)

  useEffect(() => {
    const updateCoverImage = async () => {
      if (post?.coverImage) {
        const imageKey = await Storage.get(post.coverImage)
        setCoverImage(imageKey)
      }
    }

    updateCoverImage()
  }, [post?.coverImage])

  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!post) return null

  return (
    <div>
      <h1 className="mt-4 text-5xl font-semibold tracking-wide">
        {post.title}
      </h1>
      {coverImage && (
        <Image
          src={coverImage}
          className="mt4"
          alt="post-image"
          width={300}
          height={200}
        />
      )}
      <p className="my-4 text-sm font-light">By {post.username}</p>
      <div className="mt-8">
        <ReactMarkDown className="prose">{post.content ?? ''}</ReactMarkDown>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const { data } = API.graphql({
    query: listPosts,
  }) as GraphQLResult<ListPostsQuery>

  const posts = [
    ...((data?.listPosts?.items.filter((item) => item != null) as Post[]) ??
      []),
  ]

  const paths = posts.map((post) => {
    return {
      params: {
        id: post.id,
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const id = context.params?.id
  const { data } = (await API.graphql({
    query: getPost,
    variables: { id },
  })) as GraphQLResult<GetPostQuery>

  return {
    props: {
      post: data?.getPost,
    },
    revalidate: 1,
  }
}

export default Post
