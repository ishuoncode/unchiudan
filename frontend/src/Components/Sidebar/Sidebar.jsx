/* eslint-disable react/prop-types */
import { FaFileAlt, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ setSelectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleSearch = () => {
    setSelectedCategory(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const categories = [
    { name: "UPSC", category: "UPSC" },
    { name: "BPSC", category: "BPSC" },
    { name: "SSC-Bass", category: "SSC-Bass" },
    { name: "BiharDaroga", category: "BiharDaroga" },
    { name: "Railway", category: "Railway" },
  ];

  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    axios
      .get("https://ucchi-urran-backend.vercel.app/api/pdfs/lastestPdfs")
      .then((response) => {
        setPdfs(response.data.data.pdf);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="p-4 space-y-10">
      <div className="flex items-center mx-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 w-full rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-10 bg-indigo-500 text-white p-3 rounded-md flex items-center md:right-4 hover:bg-indigo-600 focus:outline-none"
        >
          <FaSearch className="mx-2" />
        </button>
      </div>

      <div className="my-10">
        <h1 className="text-center text-xl">Search By Category</h1>
        <ul className="flex flex-col space-y-2 m-4">
          {categories.map((item, index) => (
            <li className="flex space-x-2" key={index}>
              <span className="h-2 w-2 bg-black rounded-md my-auto"></span>
              <button
                onClick={() => setSelectedCategory(item.category)}
                className="text-purple-300 hover:text-purple-500"
              >
                {item.name}
              </button>
            </li>
          ))}
          <li className="flex space-x-2">
            <span className="h-2 w-2 bg-black rounded-md my-auto"></span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-purple-300 hover:text-purple-500"
            >
              All Category
            </button>
          </li>
        </ul>
      </div>

      <div className="my-10">
        <h1 className="text-center text-xl">Latest Pdf</h1>
        <ul className="flex flex-col space-y-3 m-4">
          {pdfs.map((pdf) => {
            const createdAt = new Date(pdf.createdAt);
            const formattedDate = createdAt.toLocaleString("default", {
              day: "numeric",
              month: "long",
            });
            return (
              <Link to={`/downloadpdf/${pdf._id}`} key={pdf._id}>
                <div className="w-18 flex justify-between p-4 border border-2 rounded-lg">
                  <div>
                    <FaFileAlt className="w-12 h-12" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-center text-md">{pdf.name}</h1>
                    <p>{formattedDate}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;