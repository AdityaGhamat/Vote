import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";

const Navbar = () => {
  const { account, isAdmin } = useWeb3();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Election DApp
        </Link>
        <div className="flex space-x-4">
          <Link to="/registration" className="hover:text-blue-200">
            Registration
          </Link>
          <Link to="/voting" className="hover:text-blue-200">
            Voting
          </Link>
          <Link to="/results" className="hover:text-blue-200">
            Results
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-blue-200">
              Admin Panel
            </Link>
          )}
          <span className="text-sm">
            {account
              ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
              : "Not Connected"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
