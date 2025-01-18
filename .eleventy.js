const markdownItMark = require("markdown-it-mark");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/style.css');
    eleventyConfig.addPassthroughCopy('./src/assets');

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItMark));

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}