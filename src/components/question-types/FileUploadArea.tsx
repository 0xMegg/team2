import React from "react";

const FileUploadArea = () => (
  <div className="w-full p-5 border-dashed border-2 border-gray-300 rounded-md flex flex-col justify-center items-center text-gray-500 text-center">
    <span>파일을 여기에 드롭하거나</span>
    <input type="file" className="hidden" id="file-upload-input" />
    <label
      htmlFor="file-upload-input"
      className="text-blue-600 cursor-pointer mt-1"
    >
      클릭하여 업로드하세요.
    </label>
  </div>
);

export default FileUploadArea;
