
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function PdfComp({ title, date }) {
  return (
    <Link to="/downloadpdf/id">
    <div className="w-18 flex justify-between p-4 border border-2 rounded-lg">
      <div>
        <FaFileAlt className="w-12 h-12" />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-center text-md">{title}</h1>
        <p>{date}</p>
      </div>
    </div>
    </Link>
  );
}

export default PdfComp;
