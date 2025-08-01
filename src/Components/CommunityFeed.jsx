import React, { useState, useEffect } from "react";
import defaultProfilePic from "../assets/images/Sample_User_Image.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customFetch from "../utils/customFetch";

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState({ postId: "", content: "" });
  const [visibleComments, setVisibleComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customFetch.get("/posts");
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await customFetch.post("/posts/like", { postId });
      const updatedPost = response.data.post;
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await customFetch.post("/posts", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts([response.data.post, ...posts]);
      setNewPost({ title: "", content: "" });
      toast.success("Post added successfully!");
    } catch (err) {
      console.error("Error adding post:", err);
      toast.error("Failed to add post.");
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await customFetch.post(
        "/posts/comment",
        { postId, content: newComment.content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedPost = response.data.post;
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
      setNewComment({ postId: "", content: "" });
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment.");
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await customFetch.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete the post.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await customFetch.delete(`/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedComments = response.data.comments;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      );

      toast.success("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete the comment.");
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-xl font-bold text-blue-700">Loading posts...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gray-50 min-h-screen space-y-8">
      <ToastContainer position="top-center" />
      
      {/* Community Feed Header */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg mb-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-blue-800">Welcome to the Community Feed</h1>
        <p className="text-lg text-gray-700 mt-2">
          Join discussions, share your thoughts, and connect with others!
        </p>
      </div>

      {/* Post Creation */}
      <div className="card bg-white shadow-lg p-6 rounded-lg">
        <form onSubmit={handleAddPost} className="space-y-4">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Enter post title"
            className="input input-bordered w-full"
          />
          <textarea
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            placeholder="Write your post here..."
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
          <button type="submit" className="btn bg-blue-900 hover:bg-blue-700 text-white w-full">
            Add Post
          </button>
        </form>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-gray-600">No posts available</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="card bg-white shadow-lg p-6 rounded-lg">
              {/* Post Content */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={defaultProfilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border"
                  />
                  <span className="text-sm font-medium">{post.username || "Anonymous"}</span>
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="btn btn-error btn-sm text-white"
                >
                  Delete Post
                </button>
              </div>
              <h2 className="text-xl font-semibold mt-4">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.content}</p>
              {/* Post Actions */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleLike(post._id)}
                  className="btn btn-outline btn-sm"
                >
                  Like ({post.likes})
                </button>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Comments Section */}
              <button
                onClick={() => toggleCommentsVisibility(post._id)}
                className="text-sm text-blue-600 hover:underline mt-4"
              >
                {visibleComments[post._id] ? "Hide comments" : "Show comments"}
              </button>
              {visibleComments[post._id] && (
                <div className="space-y-4 mt-4">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="p-4 bg-gray-100 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-800">
                          {comment.username || "Anonymous"}
                        </span>
                        <button
                          onClick={() =>
                            handleDeleteComment(post._id, comment._id)
                          }
                          className="btn btn-error btn-xs text-white"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm mt-2">{comment.content}</p>
                    </div>
                  ))}
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment.postId === post._id ? newComment.content : ""}
                    onChange={(e) =>
                      setNewComment({
                        content: e.target.value,
                        postId: post._id,
                      })
                    }
                    className="textarea textarea-bordered w-full"
                    rows="2"
                  ></textarea>
                  <button
                    onClick={(e) => handleAddComment(e, post._id)}
                    className="btn bg-blue-900 hover:bg-blue-700 text-white btn-sm mt-2"
                  >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
