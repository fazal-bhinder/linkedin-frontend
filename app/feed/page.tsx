"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@radix-ui/themes'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  User, 
  LogOut, 
  Plus, 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Send,
  Users
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
}

interface Post {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  _count: {
    likes: number
    comments: number
  }
  isLiked: boolean
}

export default function FeedPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    setUser(JSON.parse(userData))
    fetchPosts()
  }, [router])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        throw new Error('Failed to fetch posts')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost })
      })

      if (response.ok) {
        const post = await response.json()
        setPosts([post, ...posts])
        setNewPost('')
        setShowCreatePost(false)
        toast({
          title: "Success!",
          description: "Post created successfully",
        })
      } else {
        throw new Error('Failed to create post')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const { liked } = await response.json()
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: liked,
                _count: { 
                  ...post._count, 
                  likes: liked ? post._count.likes + 1 : post._count.likes - 1 
                }
              }
            : post
        ))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navigateToProfile = () => {
    router.push('/profile')
  }

  const navigateToUsers = () => {
    router.push('/users')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-linkedin-600">Community</h1>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size= "1"
                  onClick={() => router.push('/feed')}
                  className="text-linkedin-600"
                >
                  <Home className="w-4 h-4 mr-1 cursor-pointer" />
                  <span className="cursor-pointer">Home</span>
                </Button>
                <Button
                  variant="ghost"
                  size="1"
                  onClick={navigateToUsers}
                >
                  <Users className="w-4 h-4 mr-1 cursor-pointer" />
                  <span className="cursor-pointer">People</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="1"
                onClick={navigateToProfile}
                className="flex items-center space-x-2"
              >
                <Avatar className="w-6 h-6 cursor-pointer">
                  <AvatarImage src={user?.avatar} className='cursor-pointer'/>
                  <AvatarFallback className='cursor-pointer'>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="1"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <div className="p-4">
              {!showCreatePost ? (
                <div 
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-500 flex-1">What's on your mind?</span>
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="What's on your mind?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="border-0 focus:ring-0 text-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="1"
                      onClick={() => setShowCreatePost(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="1"
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || submitting}
                      className="bg-linkedin-600 hover:bg-linkedin-700"
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Posting...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-1" />
                          Post
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Posts Feed */}
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <Card className="hover:shadow-md transition-shadow">
                <div className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {post.author.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="pt-0">
                  <p className="text-gray-900 mb-4 leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="1"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post._count.likes}</span>
                      </Button>
                      <Button variant="ghost" size="1" className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post._count.comments}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-gray-400">Be the first to share something with the community!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 