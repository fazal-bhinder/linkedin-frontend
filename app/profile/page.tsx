"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Card } from '@radix-ui/themes'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  FileText,
  Heart,
  MessageCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  createdAt: string
  posts: Post[]
  _count: {
    posts: number
    likes: number
  }
}

interface Post {
  id: string
  content: string
  createdAt: string
  _count: {
    likes: number
    comments: number
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    bio: ''
  })
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setEditData({
          name: data.name,
          bio: data.bio || ''
        })
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(prev => prev ? { ...prev, ...updatedUser } : null)
        setEditing(false)
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      bio: user?.bio || ''
    })
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <Button onClick={() => router.push('/feed')}>Go back to feed</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="1"
              onClick={() => router.push('/feed')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </Button>
            
            <h1 className="text-xl font-bold text-linkedin-600">Profile</h1>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {editing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="text-2xl font-bold mb-2"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Member since {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {editing ? (
                        <>
                          <Button
                            size="1"
                            onClick={handleSave}
                            className="bg-linkedin-600 hover:bg-linkedin-700"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="1"
                            onClick={handleCancel}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="1"
                          onClick={() => setEditing(true)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {editing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <Input
                          value={editData.bio}
                          onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.bio && (
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4 text-linkedin-600" />
                          <span className="font-medium">{user._count.posts}</span>
                          <span className="text-gray-500">posts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-medium">{user._count.likes}</span>
                          <span className="text-gray-500">likes given</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Section */}
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Posts ({user.posts.length})</span>
              </div>
              {user.posts.length > 0 ? (
                <div className="space-y-4">
                  {user.posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 leading-relaxed">{post.content}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(post.createdAt)}</span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post._count.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Start sharing your thoughts with the community!</p>
                  <Button
                    onClick={() => router.push('/feed')}
                    className="mt-4 bg-linkedin-600 hover:bg-linkedin-700"
                  >
                    Create Your First Post
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 