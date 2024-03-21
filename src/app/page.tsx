import React from "react";

const HtmlComponent = () => {
  // Import the HTML file
  const htmlContent = require("../../public/gg.html");

  return <div dangerouslySetInnerHTML={{ __html: htmlContent.default }} />;
};

export default HtmlComponent;
