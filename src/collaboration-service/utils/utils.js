exports.getDefaultAttempt = (questionTitle) => {
  const words = questionTitle.split(" ");
  let formatted = "";
  words.forEach((word, index) => {
    if (word.length === 0) {
      return;
    }
    
    if (index > 0) {
      formatted += word[0].toUpperCase() + word.slice(1).toLowerCase();
    } else {
      formatted = word.toLowerCase();
    }
  });

  const functionName = formatted;

  const defaultAttempt = {
    "cpp": `#include <iostream>\n\n//change your function type below if necessary\nvoid ${functionName}(/*define your params here*/) {\n\t//your function implementation goes here\t\n};\n\nint main() {\n\t//print your output here to check. e.g:\n\t//std::cout << YOUR-OUTPUT-HERE << std::endl;\n}`,
    "java": `class Main {\n\t//change your function type below if necessary\n\tpublic static void ${functionName}(/*define your params here*/) {\n\t\t//your function implementation goes here\t\n\t};\n\n\tpublic static void main(String[] args) {\n\t//print your output here to check. e.g:\n\t//System.out.println(YOUR-OUTPUT-HERE);\n\t}\n}`,
    "python": `#define your params here\ndef ${functionName}():\n\t#your function implementation goes here\n\n#print your output here to check. e.g below:\n#print(YOUR-OUTPUT-HERE)`,
    "javascript": `const ${functionName} = (/*define your params here*/) => {\n\t//your function implementation goes here\n}\n\n//print your output here to check. e.g:\n//console.log(YOUR-OUTPUT-HERE);`,
  };

  return defaultAttempt;
}