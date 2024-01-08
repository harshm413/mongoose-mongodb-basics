import mongoose from 'mongoose';

mongoose
    .connect('mongodb://127.0.0.1:27017/mongoose_tutorial')
    .then(() => console.log('Connection Success!!!'))
    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
});
const postSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: Number,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
});
const commentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    text: {
        type: String,
        required: true,
    },
    postId: {
        type: Number,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
});

const user = mongoose.model('User', userSchema);
const post = mongoose.model('Post', postSchema);
const comment = mongoose.model('Comment', commentSchema);

async function creating() {
    //can use insertMany
    return await post.create([
        {
            id: 11,
            title: 'First Post',
            content: 'Content for the first post.',
            authorId: 1,
            likes: 10,
        },
        {
            id: 12,
            title: 'Second Post',
            content: 'Content for the second post.',
            authorId: 2,
            likes: 15,
        },
    ]);
}

async function deletingOne() {
    return await post.deleteOne({
        id: 7,
    });
}

async function deletingMany() {
    return await post.deleteMany({
        id: 4,
        title: 'Fourth Post',
    });
}

async function findAll() {
    //also have findOne
    return await comment.find({}, { _id: false, text: true, likes: true });
}

async function findSome() {
    return await comment.find(
        {
            likes: { $gt: 4 },
        },
        {
            _id: false,
            text: true,
            likes: true,
        }
    );
}

async function insertingMany() {
    return await user.insertMany([
        {
            id: 6,
            username: 'emma',
            email: 'emma@example.com',
            subscribers: 80,
        },
        {
            id: 7,
            username: 'frank',
            email: 'frank@example.com',
            subscribers: 110,
        },
    ]);
}

async function updatingOne() {
    return await comment.updateOne(
        {
            id: 7,
        },
        {
            text: 'Hello, Mongoose',
        }
    );
}

async function updatingMany() {
    return await comment.updateMany(
        {
            likes: { $gt: 5 },
        },
        {
            text: 'Hello, Mongoose',
        }
    );
}

async function leaning() {
    return await post
        .find({}, { _id: false, title: true, content: true, likes: true })
        .lean();
}

async function grouping() {
    return await post.aggregate([
        {
            $match: { likes: { $gt: 12 } },
        },
        {
            $group: { _id: '$authorId', total: { $sum: 1 } },
        },
        {
            $sort: { _id: -1 },
        },
    ]);
}

async function lookingUp() {
    return await user.aggregate([
        {
            $lookup: {
                from: 'posts',
                localField: 'id',
                foreignField: 'authorId',
                as: 'POSTS',
            },
        },
        {
            $project: {
                _id: false,
                id: true,
                username: true,
                subscribers: true,
                POSTS: true,
            },
        },
    ]);
}

async function main() {
    //use function here
    const result = await lookingUp();
    console.log(result);
}

main();
