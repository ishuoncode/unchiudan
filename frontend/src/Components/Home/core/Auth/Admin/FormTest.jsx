import { useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import JoditEditor from "jodit-react";

const postaffairs = async (testData) => {
  const token = localStorage.getItem("jwt_token");
  console.log("🚀 ~ postaffairs ~ testData:", testData);

  // const formData = new FormData();

  // formData.append("name", testData.name);
  // formData.append("mainstart", testData.mainstart);
  // formData.append("mainend", testData.mainend);
  // formData.append("data", JSON.stringify(testData.data));
  // formData.append("photo", testData.photo);
  // formData.append("correctmark", testData.correctmark);
  // formData.append("testtime", testData.testtime);
  // formData.append("negativemark", testData.negativemark);

  // console.log("🚀 ~ postaffairs ~ formData:", formData);

  let loadingToast;
  try {
    loadingToast = toast.loading("Posting TestData...");
    await axios.post(`http://localhost:3000/api/test`, testData, {
      headers: {
        Authorization: token,
      },
    });
    toast.dismiss(loadingToast);
    toast.success("Test posted successfully!");
  } catch (error) {
    console.error(error);
    toast.dismiss(loadingToast);
    toast.error("Error posting Test. Please try again.");
  }
};

const FormTest = () => {
  const topicEditor = useRef(null);
  const descriptionEditor = useRef(null);

  const initialFormData = {
    name: "",
    mainstart: 0,
    mainend: 2,
    correctmarks: "",
    negativemarks:"0",
    testtime: 2,
    photo: null,
    data: [{ ques: "", options: ["", "", "", ""], ans: "" }],
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleEditorChange = (field, newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: newContent,
    }));
  };

  const handleChange = (e, questionIndex) => {
    const { name, value } = e.target;
    const updatedData = [...formData.data];
    updatedData[questionIndex][name] = value;

    setFormData((prevData) => ({
      ...prevData,
      data: updatedData,
    }));
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const newFormData = [...formData.data];
    newFormData[questionIndex].options[optionIndex] = value;

    setFormData({
      ...formData,
      data: newFormData,
    });
  };

  function addMinutesToCurrentTime(minutes) {
    const x = Date.now(); // Get the current timestamp in milliseconds

    // Convert minutes to milliseconds (1 minute = 60,000 milliseconds)
    const millisecondsToAdd = minutes * 60000;

    // Add the milliseconds to the current timestamp
    const addTime = x + millisecondsToAdd;

    return addTime;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formdata = formData.data;
    if (formData.data[0].ques === "") {
      formdata = [];
    }
    console.log(formdata);

    const formopen = formData.mainstart + formData.mainend;
    const mainstart = addMinutesToCurrentTime(formData.mainstart);
    const mainend = addMinutesToCurrentTime(formopen);
    const testtime = parseInt(formData.testtime)

    const negativemarks = parseFloat(
      formData.negativemarks.replace(/[-+]/g, "")
    );
    const correctmarks = parseFloat(formData.correctmarks.replace(/[-+]/g, ""));

    try {
      await postaffairs({
        name: formData.name,
        mainstart,
        mainend,
        data: formdata,
        photo: formData.photo,
        correctmarks,
        negativemarks,
        testtime,
      });

      // Reset the form data to its initial values after successful submission
      // setFormData({ ...initialFormData });

      // Optionally, you can clear the JoditEditor content
      if (topicEditor.current) {
        topicEditor.current.value = "";
      }
      if (descriptionEditor.current) {
        descriptionEditor.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Error posting CurrentAffairs. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleRemoveQuestion = (indexToRemove) => {
    const updatedQuestions = formData.data.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({
      ...formData,
      data: updatedQuestions,
    });
  };

  const handleMainStartChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mainstart: value,
    }));
  };

  const handleMainEndChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mainend: value,
    }));
  };

  const handleTestTimeChange = (e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      testtime: value,
    }));
  };

  const handleCorrectMarkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNegativeMarkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <form className="mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="topic"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <JoditEditor
            ref={topicEditor}
            type="text"
            id="name"
            name="name"
            onBlur={(content) => handleEditorChange("name", content)}
            onChange={(content) => {}}
            value={formData.name}
            // onChange={(e) =>
            //   setFormData({ ...formData, topic: e.target.value })
            // }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Test start
          </label>
          <select
            name="mainstart"
            value={formData.mainstart}
            onChange={handleMainStartChange}
            className="border p-2 w-full text-black"
            required
          >
            <option value="0">Now</option>
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
            <option value="240">4 hours</option>
            <option value="300">5 hours</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Test Open
          </label>
          <select
            name="mainend"
            value={formData.mainend}
            onChange={handleMainEndChange}
            className="border p-2 w-full text-black"
            required
          >
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
            <option value="240">4 hours</option>
            <option value="300">5 hours</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Correct Mark
          </label>
          <input
            type="string"
            name="correctmarks"
            value={formData.correctmarks}
            onChange={handleCorrectMarkChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Negative Mark (Eg: 0.25 *Donot write (-)sign)
          </label>
          <input
            type="string"
            name="negativemarks"
            value={formData.negativemarks}
            onChange={handleNegativeMarkChange}
            className="border p-2 w-full text-black"
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            User Test Time
          </label>
          <select
            name="testtime"
            value={formData.testtime}
            onChange={handleTestTimeChange}
            className="border p-2 w-full text-black"
            required
          >
            <option value="2">2 minutes</option>
            <option value="3">3 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="25">25 minutes</option>
            <option value="30">30 minutes</option>
            <option value="35">35 minutes</option>
            <option value="40">40 minutes</option>
            <option value="45">45 minutes</option>
            <option value="50">50 minutes</option>
            <option value="55">55 minutes</option>
            <option value="60">60 minutes</option>
            <option value="70">70 minutes</option>
            <option value="80">80 minutes</option>
            <option value="90">90 minutes</option>
            <option value="100">100 minutes</option>
            <option value="120">120 minutes</option>
            <option value="180">180 minutes</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Questions Section */}
        {formData.data.map((question, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`ques${index}`}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Question {index + 1}
            </label>
            <input
              type="text"
              id={`ques${index}`}
              name="ques"
              value={question.ques}
              onChange={(e) => handleChange(e, index)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label>Option: {optionIndex + 1}</label>
                <input
                  type="text"
                  id={`option${index}-${optionIndex}`}
                  name="option"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index, optionIndex)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            <label
              htmlFor={`ans${index}`}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Answer {index + 1} <br />
              *please put option Number only
            </label>
            <input
              type="text"
              id={`ans${index}`}
              name="ans"
              value={question.ans}
              onChange={(e) => handleChange(e, index)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        <span className="flex space-x-6">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                data: [
                  ...formData.data,
                  { ques: "", options: ["", "", "", ""], ans: "" },
                ],
              })
            }
            className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </span>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default FormTest;
