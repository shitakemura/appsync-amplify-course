import type { NextPage } from 'next'
import { API } from 'aws-amplify'
import { listPosts } from '../src/graphql/queries'
import { useEffect, useState } from 'react'
import { Post, ListPostsQuery } from '../src/API'
import { GraphQLResult } from '@aws-amplify/api-graphql'

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = (await API.graphql({
        query: listPosts,
      })) as GraphQLResult<ListPostsQuery>

      const posts = [
        ...((data?.listPosts?.items.filter(
          (item) => item != null
        ) as Post[]) ?? []),
      ]
      setPosts(posts)
    }
    fetchPosts()
  }, [])

  return (
    <div>
      <h1 className="text-sky-400 text-3xl font-bold underline">MyPosts</h1>
      {posts.map((post) => {
        return <p key={post.id}>{post.content}</p>
      })}
    </div>
  )
}

export default Home
