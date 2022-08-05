import { useEffect, useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import CommentForm from './CommentForm';
import Comment from './Comment';
import uniqid from 'uniqid';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

function PostPage() {
  const [searchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [post, setPost] = useState({});

  const getPost = async () => {
    try {
      let res = await fetch(
        `http://localhost:5000/api/post/${searchParams.get('id')}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      let resJson = await res.json();
      setPost(resJson);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const checkLike = () => {
    return post.likes.includes(localStorage.getItem('user'));
  };

  const handleLike = async () => {
    if (checkLike()) {
      try {
        await fetch(`http://localhost:5000/api/post/like/${post._id}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await fetch(`http://localhost:5000/api/post/like/${post._id}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    getPost();
  };

  if (isLoaded) {
    let date = new Date(post.timeStamp);
    return (
      <div key={uniqid()} className="post">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <span>
          Written by: {post.user.firstName} (
          <NavLink to={`/profile?id=${post.user._id}`}>
            {post.user.username}
          </NavLink>
          ) on{' '}
          {date.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
        <div className="likes">
          {post.likes.length === 1
            ? 'Liked by 1 person'
            : `Liked by ${post.likes.length} people`}
        </div>
        <div className="buttons">
          <div className="like" onClick={handleLike}>
            {checkLike() ? (
              <FavoriteOutlinedIcon
                fontSize="small"
                sx={{ color: 'rgb(255, 73, 73)' }}
              />
            ) : (
              <FavoriteBorderOutlinedIcon fontSize="small" />
            )}
          </div>
        </div>
        <div className="commentsection">
          <CommentForm postId={post._id} getPost={getPost} />
          <div id="comments">
            <h3>Comments:</h3>
            {post.comments
              .slice(0)
              .reverse()
              .map((comment) => {
                let date = new Date(comment.timeStamp);
                comment.date = date;
                return (
                  <Comment
                    key={uniqid()}
                    getPost={getPost}
                    post={searchParams.get('id')}
                    comment={comment}
                  />
                );
              })}
          </div>
        </div>
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default PostPage;
