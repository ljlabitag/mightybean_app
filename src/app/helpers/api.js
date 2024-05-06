
module.exports = {
    getIdParam: async (url) => {
        let urlParts = url.split("/")
        let urlPartsLength = urlParts.length

        return urlParts[urlPartsLength-1]
    }
}