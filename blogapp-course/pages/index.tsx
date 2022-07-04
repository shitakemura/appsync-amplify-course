import type { NextPage } from 'next'
import { API, graphqlOperation } from 'aws-amplify'
import { listPosts } from '../src/graphql/queries'
import { useEffect, useState } from 'react'
import { Post, ListPostsQuery, NewOnCreatePostSubscription } from '../src/API'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import Link from 'next/link'
import { newOnCreatePost } from '../src/graphql/subscriptions'

type SubscriptionValue = {
  value: {
    data: NewOnCreatePostSubscription
  }
}

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState<Post | null>(null)

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

  useEffect(() => {
    let subscription: any
    const initSubscription = async () => {
      subscription = (
        API.graphql(graphqlOperation(newOnCreatePost)) as any
      ).subscribe({
        next: ({ value }: SubscriptionValue) =>
          setNewPost(value.data.newOnCreatePost ?? null),
      })
    }
    initSubscription()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  console.log(`=== newPost: ${JSON.stringify(newPost)} ===`)

  return (
    <div>
      <h1 className="tracking-mode-wide mt-6 mb-2 text-3xl font-bold text-sky-400">
        MyPosts
      </h1>
      {posts.map((post) => {
        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="mt-8 cursor-pointer border-b border-gray-300 pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-gray-500">Author: {post.username}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Home
