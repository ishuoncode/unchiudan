/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

function NewsComp({ testsItems, userData, onTestsDelete }) {
  let role;

  if (userData) {
    if (userData.user.role === "admin") {
      role = true;
    } else {
      role = false;
    }
  } else {
    role = false;
  }

  const handleDeleteClick = async (event, testsId) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this item?")) {
      const token = localStorage.getItem("jwt_token");
      let loadingToast;
      try {
        loadingToast = toast.loading("Deleting Test..."); // Display loading toast
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/test/${testsId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          toast.dismiss(loadingToast);
          // Perform any additional actions you need here
          console.log("Tests item deleted successfully");
          toast.success("Tests item deleted successfully");
          if (typeof onNewsDelete === "function") {
            onTestsDelete();
          }
        } else {
          toast.dismiss(loadingToast);
          console.error("Error deleting Tests item:", response);
          toast.error("Error deleting Tests item");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error deleting Tests item:", error);
        toast.error("Error deleting Tests item");
      }
    }
  };
  const decodeHtmlEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };


  return (
    <div className="flex flex-col md:w-[429%]">
      {testsItems.length === 0 ? (
        <div className="items-center justify-center">
          <p className="text-center text-gray-500">No news items available.</p>
        </div>
      ) : (
        testsItems.map((test) => {
          const createdAt = new Date(test.createdAt);
          {
            /* createdAt.setDate(createdAt.getDate() + 1); */
          }
          const formattedDate = createdAt.toLocaleString("default", {
            day: "numeric",
            month: "long",
          });
          const decodedName = decodeHtmlEntities(test.name);
          const decodedStart = decodeHtmlEntities(test.start);
          const decodedEnd = decodeHtmlEntities(test.end);
          
          return (
            <Link
              to={`/test/${test._id}`}
              key={test._id}
              className="block w-full md:w-[48%] lg:w-[30%] xl:w-[24%] mb-8"
            >
              <div className="relative flex flex-col md:flex-row md:space-x-5 my-6 md:space-y-0 rounded-xl shadow-lg max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
                {role ? (
                  <button
                    className="absolute top-0 right-0 text-red-600 cursor-pointer bg-red-500 rounded-full p-2"
                    style={{ zIndex: 1 }}
                    onClick={(event) => handleDeleteClick(event, test._id)}
                  >
                    <MdOutlineDelete size={32} color="#fff" />
                  </button>
                ) : (
                  ""
                )}
                <div className="w-full md:w-1/3 bg-white">
                  <img
                    className="w-full h-[200px] object-cover rounded-xl"
                    src={`${import.meta.env.VITE_BACKEND_URL_IMAGE}/img/test/${
                      test.photo
                    }`}
                    alt={`logo`}
                  />
                </div>
                <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                  <div className="flex justify-between items-center">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-xs flex font-medium text-gray-800 space-x-3">
                      {formattedDate}
                    </div>
                  </div>
                  <h3
                    className="font-black text-gray-800 md:text-2xl text-xl "
                    dangerouslySetInnerHTML={{ __html: decodedName }}
                    
                  />
                  <p className="font-black text-gray-800 md:text-base text-[20px]">
                    Start At <span dangerouslySetInnerHTML={{ __html: decodedStart }}/>
                  </p>
                  <p className="font-black text-gray-800 md:text-base text-[20px]">
                    End At : <span dangerouslySetInnerHTML={{ __html: decodedEnd }}/>
                  </p>
                  <button className="mt-4 text-md hover-bg-indigo-600 w-full text-white bg-indigo-400 py-1 px-3 rounded-xl hover:shadow-xl">
                    Start Test
                  </button>
                </div>
              </div>
            </Link>
          );
        })
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default NewsComp;