import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { BlogPost } from "../../../types/models/BlogPost.model";
import BlogPostService from "../../../Services/BlogPostService";
import BlogPostForm from "../../molecules/BlogPostForm/BlogPostForm";
import { useNavigate, useParams } from "react-router-dom";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";

/* Class for blog creation or to update an existing blog under 
the currenly logged in user. This class calls up the BlogPostForm 
to modify the blogs. */

const BlogCreation = () => {
  const navigate = useNavigate();
  const { blogPostId } = useParams();
  const { user } = useContext(ActiveUserContext);
  const [blogPost, setBlogPost] = useState<BlogPost>({
    id: "",
    title: "",
    text: "",
    user: { id: "", firstName: "", lastName: "", email: "", roles: [] },
    category: "",
  });

  useEffect(() => {
    return () => {
      if (blogPostId) {
        BlogPostService.getBlogPost(blogPostId)
          .then((res) => {
            return setBlogPost(res);
          })
          .catch((error) => {
            console.log(error + " failed to get blog post");
          });
      }
    };
  }, [blogPostId]);

  const submitActionHandler = (values: BlogPost) => {
    let valuesToSubmit = values;
    valuesToSubmit.user.id = user?.id ?? "";
    if (blogPostId !== undefined) {
      BlogPostService.updateBlogPost(values).then(() => {
        navigate("/dashboard/" + values.id);
      });
    } else {
      BlogPostService.addBlogPost(values).then(() => {
        navigate("/dashboard/" + valuesToSubmit.user.id);
      });
    }
  };

  return (
    <BlogPostForm
      blogPost={blogPost}
      submitActionHandler={submitActionHandler}
    />
  );
};

export default BlogCreation;
