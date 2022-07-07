import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Auth, Storage } from 'aws-amplify'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  Post,
  PostsByUsernameQuery,
  PostsByUsernameQueryVariables,
} from '../../src/API'
import { postsByUsername } from '../../src/graphql/queries'
import { deletePost as deletePostMutation } from '../../src/graphql/mutations'
import Moment from 'moment'
import Image from 'next/image'

const MyPosts: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([])

  const fetchPostsByUsername = async () => {
    const { attributes, username } = await Auth.currentAuthenticatedUser()
    const { data } = (await API.graphql({
      query: postsByUsername,
      variables: {
        username: `${attributes.sub}::${username}`,
      } as PostsByUsernameQueryVariables,
    })) as GraphQLResult<PostsByUsernameQuery>

    const posts = [
      ...((data?.postsByUsername?.items.filter(
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

  useEffect(() => {
    fetchPostsByUsername()
  }, [])

  const deletePost = async (id: string) => {
    const _ = (await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } } as DeletePostMutationVariables,
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<DeletePostMutation>
    fetchPostsByUsername()
  }

  return (
    <div className="max-w-xxl mx-auto mb-2 rounded bg-white py-8 px-8 sm:items-center sm:space-y-0 sm:space-x-6">
      <h1 className="mt-6 mb-8 text-3xl font-semibold tracking-wide">
        My Posts
      </h1>
      {posts.map((post) => (
        <div key={post.id}>
          <div className="mt-8 cursor-pointer border-b border-gray-300 pb-4">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                width={72}
                height={72}
                className="rounded-full bg-contain bg-center sm:mx-0 sm:shrink-0"
                alt="post-image"
              />
            )}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-500">Author: {post.username}</p>
            <p className="font-medium text-slate-500">
              Created on: {Moment(post.createdAt).format('ddd, MMMM hh:mm a')}
            </p>
          </div>
          <div>
            <p className="mr-4 text-sm">
              <Link href={`/posts/${post.id}`}>View Post</Link>
            </p>
            <p className="mr-4 text-sm text-blue-500">
              <Link href={`/edit-post/${post.id}`}>Edit Post</Link>
            </p>
            <button
              className="mr-4 text-sm text-red-500"
              onClick={() => deletePost(post.id)}
            >
              Delete Post
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyPosts
