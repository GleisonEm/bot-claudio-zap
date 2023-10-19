const mongoose = require('mongoose');

mongoose.connect('mongodb://root:123456@159.223.198.152:27017/botwhats?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ConverseSchema = new mongoose.Schema({
    state: {
        type: Number,
        default: 2,
    },
    from: String,
});

const mentionSchema = new mongoose.Schema({
    title: String,
    grupoId: String,
    users: [
        {
            id: String,
            serialized: String,
        },
    ],
});

const AudioMemeSchema = new mongoose.Schema({
    title: String,
    url: String,
});

const GroupSchema = new mongoose.Schema({
    idExternal: String,
    disableCommand: {
        type: Boolean,
        default: false,
    }
});

const Group = mongoose.model('Groups', GroupSchema);
const Converse = mongoose.model('Converses', ConverseSchema);
const Mention = mongoose.model('Mentions', mentionSchema);
const AudioMeme = mongoose.model('AudioMemes', AudioMemeSchema);

module.exports = { Converse, Mention, AudioMeme, Group };
