import React, { Component } from "react";
import '../style/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {

        return (
            <div className="outer" >
                <div className="inner">
                    <form>

                <h3>Log in</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>


                <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>

                 </form>
              </div>
            </div>

        );

}
export default Login;