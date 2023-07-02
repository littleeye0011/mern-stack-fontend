import NavbarComponent from "./components/NavbarComponent";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Parser } from "html-to-react";
import { getUser, getToken } from "./service/authorize";

function App() {
  const [blogs, setBlogs] = useState([]);

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_API}/blogs`)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        Swal.fire("ERROR!", err, "error");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = (slug) => {
    Swal.fire({
      title: "คุณต้องการที่จะลบบทความนี้หรือไม่",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(slug);
      }
    });
  };

  const deleteBlog = (slug) => {
    axios
      .delete(`${process.env.REACT_APP_API}/blog/${slug}`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        Swal.fire("Delete!", res.data.message, "success");
        fetchData();
      })
      .catch((err) => {
        Swal.fire("ERROR!", err, "error");
      });
  };

  return (
    <div className="container p-5">
      <NavbarComponent />

      {blogs.map((blog, index) => (
        <div
          className="row"
          key={index}
          style={{ borderBottom: "1px solid silver" }}
        >
          <div className="col pt-3 pb-2">
            <Link to={`/blog/${blog.slug}`}>
              <h2>{blog.title}</h2>
            </Link>
            <div>{Parser().parse(blog.content.substring(0, 180))}</div>
            <p className="text-muted">
              ผู้แต่ง : {blog.author} , เผยแพร่ :{" "}
              {new Date(blog.createdAt).toLocaleString()}
            </p>
            {getUser() && (
              <div>
                <Link
                  className="btn btn-outline-success"
                  to={`/blog/edit/${blog.slug}`}
                >
                  แก้ไขบทความ
                </Link>{" "}
                &nbsp;
                <button
                  className="btn btn-outline-danger"
                  onClick={() => confirmDelete(blog.slug)}
                >
                  ลบบทความ
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
