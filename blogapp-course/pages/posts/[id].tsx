import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import ReactMarkDown from 'react-markdown'
import '../../configureAmplify'
import { GetPostQuery, ListPostsQuery, Post } from '../../src/API'
import { getPost, listPosts } from '../../src/graphql/queries'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Post: NextPage<Props> = ({ post }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="mt-4 text-5xl font-semibold tracking-wide">
        {post?.title}
      </h1>
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
  }
}

export default Post
