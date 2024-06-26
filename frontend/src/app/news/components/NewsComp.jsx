/* eslint-disable react/prop-types */

import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { useGetUserQuery } from "../../redux/slices/userSlices";



function NewsComp({ newsItems, onNewsDelete }) {
  const { data: userData} = useGetUserQuery();
  let role;

  if (userData) {
    if (userData.role === "admin") {
      role = true;
    } else {
      role = false;
    }
  } else {
    role = false;
  }

  const isWithin48Hours = (createdAt) => {
    const now = new Date();
    const newsDate = new Date(createdAt);
    const timeDifference = now - newsDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 48;
  };

  const handleDeleteClick = async (event, newsId) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this item?")) {
      const token = localStorage.getItem("jwt_token");
      let loadingToast;
      try {
        loadingToast = toast.loading("Deleting News..."); // Display loading toast
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/news/${newsId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          toast.dismiss(loadingToast);
          // Perform any additional actions you need here
          // console.log("News item deleted successfully");
          toast.success("News item deleted successfully");
          if (typeof onNewsDelete === "function") {
            onNewsDelete();
          }
        } else {
          toast.dismiss(loadingToast);
          console.error("Error deleting news item:", response);
          toast.error("Error deleting news item");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error deleting news item:", error);
        toast.error("Error deleting news item");
      }
    }
  };

  const decodeHtmlEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };


  return (
    <div className="flex flex-col items-center justify-center w-full">
      {newsItems.length === 0 ? (
        
          <p className="text-center text-gray-500">No news items available.</p>
       
      ) : (
        newsItems.map((news) => {
          const createdAt = new Date(news.createdAt);
          {
            /* createdAt.setDate(createdAt.getDate() + 1); */
          }
          const formattedDate = createdAt.toLocaleString("default", {
            day: "numeric",
            month: "long",
          });

          const isRecent = isWithin48Hours(news.createdAt);

          const decodedHeading = decodeHtmlEntities(news.heading);
          const decodedArticle = decodeHtmlEntities(news.article);
          const maxArticleLength = 200; 
          const trimmedArticle =
            decodedArticle.length > maxArticleLength
              ? decodedArticle.substring(0, maxArticleLength) + "..."
              : decodedArticle;

          return (
            <div className="block w-full md:w-[120%] lg:w-[120%] xl:w-[120%] mb-2">
            <Link
              href={`/news/${news._id}`}
              key={news._id}
            >
              <div className="relative flex flex-col md:flex-row md:space-x-5 my-4 md:space-y-0 rounded-xl shadow-lg p-1 md:max-w-3xl mx-auto border border-white bg-white">
                {role ? (
                  <button
                    className="absolute top-0 right-0 text-red-600 cursor-pointer bg-red-500 rounded-full p-2"
                    style={{ zIndex: 1 }}
                    onClick={(event) => handleDeleteClick(event, news._id)}
                  >
                    <MdOutlineDelete size={32} color="#fff" />
                  </button>
                ) : (
                  ""
                )}
                <div className="w-full md:w-1/3 bg-white">
                  <Image
                  width={500}
                  height={500}
                    className="w-full h-[200px] object-cover rounded-xl"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/news/${
                      news.photo
                    }`}
                    alt={`logo`}
                  />
                </div>
                <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                  <div className="flex justify-between items-center">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-xs flex font-medium text-gray-800 space-x-3">
                      {formattedDate}
                      {isRecent && (
                        <div className="bg-green-400 text-white text-xs px-2 rounded-full ml-[20px]">
                          New
                        </div>
                      )}
                    </div>
                  </div>
                  <h3
                    className="font-black text-gray-800 md:text-3xl text-xl "
                    dangerouslySetInnerHTML={{ __html: decodedHeading }}
                  />
                  <p
                  className="md:text-lg text-gray-500 text-base overflow-hidden mb-[1rem]"
                    dangerouslySetInnerHTML={{ __html: trimmedArticle }}
                  />
                </div>
              </div>
            </Link>
            </div>
          );
        })
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
   
  );
}

export default NewsComp;