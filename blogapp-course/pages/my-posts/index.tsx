import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Auth } from 'aws-amplify'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Post, PostsByUsernameQuery } from '../../src/API'
import { postsByUsername } from '../../src/graphql/queries'

const MyPosts: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPostsByUsername = async () => {
      const { username } = await Auth.currentAuthenticatedUser()
      const { data } = (await API.graphql({
        query: postsByUsername,
        variables: { username },
      })) as GraphQLResult<PostsByUsernameQuery>

      const posts = [
        ...((data?.postsByUsername?.items.filter(
          (item) => item != null
        ) as Post[]) ?? []),
      ]
      setPosts(posts)
    }
    fetchPostsByUsername()
  }, [])

  return (
    <div>
      <h1 className="mt-6 mb-2 text-3xl font-semibold tracking-wide">
        My Posts
      </h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <div className="mt-8 cursor-pointer border-b border-gray-300 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-500">Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MyPosts
