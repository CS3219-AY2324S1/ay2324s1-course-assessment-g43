export const getColorFromComplexity = (complexity) => {
  switch (complexity) {
    case "Easy":
      // light aquamarine
      return "#9DEFCD";
    case "Medium":
      // mindaro (yellow)
      return "#FAF8A5";
    case "Hard":
      // tea rose (red)
      return "#F8C1C1";
    default:
      // french gray
      return "#CFCCD6";
  }
};
