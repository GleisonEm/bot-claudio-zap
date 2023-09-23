const mongoose = require('mongoose');

mongoose.connect('mongodb://root:123456@localhost:27017/botwhats?authSource=admin', {
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

const Converse = mongoose.model('Converses', ConverseSchema);

module.exports = { Converse };
