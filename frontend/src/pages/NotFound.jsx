import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className='notfound'>
      <div className='content'>
        <h1>404 Not Found</h1>
        <p>You may go back to home page</p>
        <Link className='btn' to={"/"}>
          Back to Home page
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
