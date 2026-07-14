;[
    {
        $match: {
            product: new ObjectId("6a56802a2fbcb4a42c8b2460"),
        },
    },
    {
        $group: {
            _id: null,
            averageRating: {
                $avg: "$rating",
            },
            numOfReviews: {
                $sum: 1,
            },
        },
    },
]
