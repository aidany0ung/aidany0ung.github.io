// Write a JS script that, every time the pages is loaded, takes the text inside div with id "name" and makes every character a different font, from the list

// Create a list of web fonts
var fonts = ["Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT", "Comic Sans MS", "Impact", "Lucida Console", "Lucida Sans Unicode", "Palatino Linotype", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"];

// Get the text from the div with id "name"
var text = document.getElementById("name").innerHTML;

// Create a new string with the text in different fonts
var newText = "";
for (let i = 0; i < text.length; i++) {
    newText += "<span style=\"font-family:" + fonts[i % fonts.length] + "\">" + text[i] + "</span>";
}

// Replace the text in the div with id "name" with the new text
//document.getElementById("name").innerHTML = newText;
