import { Text } from "@chakra-ui/react";
import { PropTypes } from "prop-types";

const scrollStyle = {
  overflowY: "auto",
  maxHeight: "50vh",
  maxWidth: "100%",
};

export const ScrollableText = ({ text }) => {
  return (
    <div style={scrollStyle}>
      {text &&
        text.split("\n").map((p, index) => (
          <Text py={1} key={index}>
            {p}
          </Text>
        ))}
    </div>
  );
};

ScrollableText.propTypes = {
  text: PropTypes.string,
  split: PropTypes.object,
};
