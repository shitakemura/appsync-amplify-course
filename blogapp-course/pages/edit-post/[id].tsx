import { GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetPostQuery, Post } from '../../src/API'
import { getPost } from '../../src/graphql/queries'

const EditPost = () => {
  const [post, setPost] = useState<Post | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      const { data } = (await API.graphql({
        query: getPost,
        variables: { id },
      })) as GraphQLResult<GetPostQuery>

      setPost(data?.getPost ?? null)
    }

    fetchPost()
  }, [id])

  const onChange = (event: any) => {
    setPost((prev) => ({ ...prev!, [event.target.name]: event.target.value }))
  }

  if (!post) return null

  return <div></div>
}

export default EditPost
