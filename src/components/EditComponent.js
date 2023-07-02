import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getToken } from "../service/authorize";

const EditComponent = () => {
  let navigate = useNavigate();

  let { slug } = useParams();

  const [state, setState] = useState({
    title: "",
    author: "",
    slug: "",
  });
  const { title, author } = state;

  const [content, setContent] = useState("");

  const submitContent = (event) => {
    setContent(event);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/blog/${slug}`)
      .then((res) => {
        // setBlog(res.data);
        const { title, content, author, slug } = res.data;
        setState({ ...state, title, author, slug });
        setContent(content);
      })
      .catch((err) => alert(err));
    // eslint-disable-next-line
  }, []);

  const inputValue = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  const preSubmit = (e) => {
    e.preventDefault();

    if (author) {
      submitForm();
    } else {
      setState({ ...state, author: "Admin" });
    }
  };

  const showUpdateForm = () => (
    <form onSubmit={preSubmit}>
      <div className="form-group">
        <label>ชื่อบทความ</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={inputValue("title")}
        />
      </div>

      <div className="form-group">
        <label>รายละเอียด</label>
        <ReactQuill
          value={content}
          onChange={submitContent}
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>

      <div className="form-group">
        <label>ผู้แต่ง</label>
        <input
          type="text"
          className="form-control"
          value={author}
          onChange={inputValue("author")}
        />
      </div>
      <br />
      <input type="submit" value="อัพเดต" className="btn btn-primary" />
    </form>
  );

  const submitForm = () => {
    axios
      .put(
        `${process.env.REACT_APP_API}/blog/${slug}`,
        {
          title,
          content,
          author,
        },
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((res) => {
        const { title, content, author, slug } = res.data;
        setState({ ...state, title, author, content, slug });

        Swal.fire("แจ้งเตือน!", "แก้ไขข้อมูลเรียบร้อย", "success").then(() => {
          navigate("/");
        });
      })
      .catch((err) => {
        Swal.fire("ERROR!", err.response.data.error, "error");
      });
  };
  return (
    <div className="container p-5">
      <NavbarComponent />
      <h1>แก้ไขบทความ</h1>
      {showUpdateForm()}
    </div>
  );
};

export default EditComponent;
