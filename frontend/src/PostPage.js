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
      let res = await fetch(`/api/post/${searchParams.get('id')}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
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
    const isLiked = post.likes.filter((like) => {
      return like._id === localStorage.getItem('user');
    });
    return isLiked.length > 0;
  };

  const handleLike = async () => {
    if (checkLike()) {
      try {
        await fetch(`/api/post/like/${post._id}`, {
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
        await fetch(`/api/post/like/${post._id}`, {
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
      <div className="postpage">
        <div key={uniqid()} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.user.profilePicture ? (
            <img
              id="profilepicture"
              src={`${post.user.profilePicture}`}
              alt="profile"
              width={30}
              height={30}
            />
          ) : (
            <img
              id="profilepicture"
              src={`/images/default.jpg`}
              alt="profile"
              width={30}
              height={30}
            />
          )}
          <div className="postinfo">
            <span>
              Written by: {post.user.firstName} (
              <NavLink to={`/frontend/profile?id=${post.user._id}`}>
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
          </div>
          <div className="postpagebuttons">
            <div className="like" onClick={handleLike}>
              {checkLike() ? (
                <FavoriteOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'rgb(255, 209, 0)' }}
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
              {post.comments.length !== 0 ? (
                post.comments
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
                  })
              ) : (
                <p>No one has posted a comment yet, be the first to comment!</p>
              )}
            </div>
            <div className="likelist">
              <h3>Likes:</h3>
              {post.likes.length !== 0 ? (
                post.likes.map((like) => {
                  return (
                    <div key={uniqid()} className="likeli">
                      <span>
                        {like.firstName} (
                        <NavLink to={`/frontend/profile?id=${like._id}`}>
                          {like.username}
                        </NavLink>
                        )
                      </span>
                    </div>
                  );
                })
              ) : (
                <p>No one has liked this post yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default PostPage;
