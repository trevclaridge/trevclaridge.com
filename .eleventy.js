module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/style.css');

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}