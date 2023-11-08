exports.convertTitleToFunctionName = (questionTitle) => {
  const words = questionTitle.split(" ");
  let formatted = "";
  words.forEach((word, index) => {
    if (index > 0) {
      formatted += word[0].toUpperCase() + word.slice(1).toLowerCase();
    } else {
      formatted = word.toLowerCase();
    }
  });
  return formatted;
};