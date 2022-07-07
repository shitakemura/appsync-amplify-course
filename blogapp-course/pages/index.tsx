import type { NextPage } from 'next'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import { listPosts } from '../src/graphql/queries'
import { useEffect, useState } from 'react'
import { Post, ListPostsQuery, NewOnCreatePostSubscription } from '../src/API'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import Link from 'next/link'
import { newOnCreatePost } from '../src/graphql/subscriptions'
import Image from 'next/image'

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

      const postsWithImages = await Promise.all(
        posts.map(async (post) => {
          if (post.coverImage) {
            post.coverImage = await Storage.get(post.coverImage)
          }
          return post
        })
      )

      setPosts(postsWithImages)
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
      <h1 className="mt-6 mb-2 text-3xl font-semibold tracking-wide text-sky-400">
        Posts
      </h1>
      {posts.map((post) => {
        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="my-6 border-b border-gray-300 pb-6">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  width={36}
                  height={36}
                  className="h-36 w-36 rounded-full bg-contain bg-center sm:mx-0 sm:shrink-0"
                  alt="post-image"
                />
              )}
              <div className="mt-2 cursor-pointer">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-gray-500">Author: {post.username}</p>
                {post.comments &&
                  post.comments.items.length > 0 &&
                  post.comments?.items.map((comment, index) => {
                    return (
                      <div
                        key={index}
                        className="max-auto my-6 mx-12 mb-2 max-w-xl space-y-2 bg-white py-8 px-8 shadow-lg sm:flex sm:items-center sm:space-y-0 sm:space-x-6 sm:py-1"
                      >
                        <div>
                          <p className="mt-2 text-gray-500">
                            {comment?.message}
                          </p>
                          <p className="mt-1 text-gray-500">
                            {comment?.createdBy}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Home
