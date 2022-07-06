import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
  GetPostQuery,
  Post,
  UpdatePostInput,
  UpdatePostMutation,
} from '../../src/API'
import { updatePost } from '../../src/graphql/mutations'
import { getPost } from '../../src/graphql/queries'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})
import 'easymde/dist/easymde.min.css'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'

const EditPost = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [localImage, setLocalImage] = useState<string | null>(null)
  const [fileImage, setFileImage] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const id = router.query.id as string

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      const { data } = (await API.graphql({
        query: getPost,
        variables: { id },
      })) as GraphQLResult<GetPostQuery>

      setPost(data?.getPost ?? null)
      if (data?.getPost?.coverImage) {
        updateCoverImage(data.getPost.coverImage)
      }
    }

    fetchPost()
  }, [id])

  const updateCoverImage = async (coverImage: string) => {
    const imageKey = await Storage.get(coverImage)
    setCoverImage(imageKey)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUpload = event.target.files ? event.target.files[0] : null
    if (!fileUpload) return
    setFileImage(fileUpload)
    setLocalImage(URL.createObjectURL(fileUpload))
  }

  const uploadImage = async () => {
    fileInput.current?.click()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev!, [event.target.name]: event.target.value }))
  }

  const updateCurrentPost = async () => {
    if (!post?.title || !post?.content) return

    const postUpdated: UpdatePostInput = {
      id,
      title: post.title,
      content: post.content,
    }

    if (fileImage && localImage) {
      const fileName = `${fileImage.name}_${uuid()}`
      postUpdated.coverImage = fileName
      await Storage.put(fileName, fileImage)
    }

    const _ = (await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as GraphQLResult<UpdatePostMutation>

    router.push('/my-posts')
  }

  if (!post) return null

  return (
    <div>
      <h1 className="mt-6 mb-2 text-3xl font-semibold tracking-wide">
        Edit Post
      </h1>
      {coverImage && (
        <div>
          <Image
            src={localImage ? localImage : coverImage}
            width={200}
            height={200}
            alt="pot-image"
            className="mt-4"
          />
        </div>
      )}
      <input
        className="focus y-2 my-4 border-b pb-2 text-lg text-gray-500 placeholder-gray-500"
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={onChange}
      />
      <SimpleMDE
        value={post.content ?? ''}
        onChange={(value) =>
          setPost((prev) => ({ ...prev!, content: value }))
        }
      />
      <input
        type="file"
        ref={fileInput}
        className="absolute h-0 w-0"
        onChange={handleChange}
      />
      <button
        className="mb-4 rounded-lg bg-purple-600 px-8 py-2 font-semibold text-white"
        onClick={uploadImage}
      >
        Upload Cover Image
      </button>
      <button
        className="mb-4 rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white"
        onClick={updateCurrentPost}
      >
        Update Post
      </button>
    </div>
  )
}

export default EditPost
