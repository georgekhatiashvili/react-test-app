import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

export default class Blog extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        this.setState({ posts: response.data });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  render() {
    const { posts } = this.state;

    const allPosts = posts.map((post) => (
      <div key={post.id} className="col-md-4 mb-4"> {/* Bootstrap grid item */}
        <div className="card">
          <div className="card-body">
            <Link to={`/posts/${post.id}`}>
              <h5 className="card-title">{post.title}</h5>
            </Link>
            <p className="card-text">{post.body}</p>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="container">
        <h1 className="my-4">This is the Blog Component</h1>
        <Link to="/writepost" className="btn btn-primary mb-4">Add New</Link>
        <div className="row">
          {allPosts}
        </div>
      </div>
    );
  }
}
