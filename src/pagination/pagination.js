exports.paginations = async (req, query, model) => {
    try {
        let page = 1;
        let limit = 10;
        let now;
        const total = await model.countDocuments(query);
        //check there is page in query
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        //check there is limit in query
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        //set now
        now = page;
        //set skip
        const skip = (page - 1) * limit;
        const pagination = {};
        if (page > 1) {
            pagination.prev = now - 1;
        }
        if (total > page * limit) {
            pagination.next = now + 1;
        }
        const data = await model.find(query)
            .sort("-createdAt")
            .skip(skip)
            .limit(limit);
        return {
            data, pagination
        }
    } catch (error) {
        console.log(error)
    }
}