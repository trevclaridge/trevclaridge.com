const { DateTime } = require("luxon");
const markdownItMark = require("markdown-it-mark");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        filenameFormat: function (id, src, width, format, options) {
            return `${id}-${width}.${format}`
        },
    });

    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItMark));


    eleventyConfig.addPassthroughCopy('./src/style.css');
    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/posts')

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("formatDate", (dateString) => {
        dateObj = new Date(dateString);
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toLocaleString(DateTime.DATE_MED);
    });

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}