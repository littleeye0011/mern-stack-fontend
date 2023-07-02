import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import NavbarComponent from "./NavbarComponent";

import { Parser } from "html-to-react";

const SingleComponent = () => {
  let { slug } = useParams();

  const [blog, setBlog] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/blog/${slug}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => alert(err));
  }, [slug]);

  return (
    <div className="container p-5">
      <NavbarComponent />
      <h1>{blog.title}</h1>
      <div>{Parser().parse(blog.content)}</div>
      <p className="text-muted">
        ผู้แต่ง : {blog.author} , เผยแพร่ :{" "}
        {new Date(blog.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default SingleComponent;
