const Property = require("../models/Property_model");
exports.propertySet = async () => {
    try {
        // featured products fatch
        const featuredProductCount = await Property.countDocuments({ listCatagory: "featured" })
        let featureRandom = Math.floor(Math.random() * featuredProductCount)
        const featuredProducts = await Property.find({ listCatagory: "featured" }).limit(6).skip(featureRandom)

        // bestSel Products fatch
        const bestSellProductsCount = await Property.countDocuments({ listCatagory: "best-sell" })
        let bestSellRandom = Math.floor(Math.random() * bestSellProductsCount)
        const bestSellProducts = await Property.find({ listCatagory: "best-sell" }).limit(6).skip(bestSellRandom)

        // most searched products fatch
        const mostSearchedCount = await Property.countDocuments({ listCatagory: "most-searched" })
        let mostSearchedRandom = Math.floor(Math.random() * mostSearchedCount)
        const mostSearchedProducts = await Property.find({ listCatagory: "most-searched" }).limit(6).skip(mostSearchedRandom)

        // recommended products fatch
        const recommendedCount = await Property.countDocuments({ listCatagory: "recommended" })
        let recommendedRandom = Math.floor(Math.random() * recommendedCount)
        const recommendedProducts = await Property.find({ listCatagory: "recommended" }).limit(6).skip(recommendedRandom)

        return { featuredProducts, bestSellProducts, mostSearchedProducts, recommendedProducts }

    } catch (error) {
        console.log(error)
    }
}