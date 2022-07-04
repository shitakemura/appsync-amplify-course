import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Auth } from 'aws-amplify'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Post, PostsByUsernameQuery } from '../../src/API'
import { postsByUsername } from '../../src/graphql/queries'
import Moment from 'moment'

const MyPosts: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPostsByUsername = async () => {
      const { attributes, username } = await Auth.currentAuthenticatedUser()
      const { data } = (await API.graphql({
        query: postsByUsername,
        variables: { username: `${attributes.sub}::${username}` },
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
    <div className="max-w-xxl mx-auto mb-2 rounded bg-white py-8 px-8 sm:items-center sm:space-y-0 sm:space-x-6">
      <h1 className="mt-6 mb-8 text-3xl font-semibold tracking-wide">
        My Posts
      </h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <div className="mt-8 cursor-pointer border-b border-gray-300 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-500">Author: {post.username}</p>
            <p className="font-medium text-slate-500">
              Created on: {Moment(post.createdAt).format('ddd, MMMM hh:mm a')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MyPosts
