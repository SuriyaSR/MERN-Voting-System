import Poll from "../models/Poll.js";

export const createPoll = async(req,res) => {
    const {title, options} = req.body;

    const poll = await Poll.create({
        title, 
        options: options.map(option => ({text: option})),
        voters: [],
        createdBy: req.user.id
    })
    res.json(poll);
}

export const getMyPolls = async(req,res) => {
    const polls = await Poll.find({createdBy: req.user.id})
    res.json(polls);
}

export const deletePoll = async(req,res) => {
    const poll = await Poll.findById(req.params.id)

    if(!poll)
        return res.status(404).json({message:"Poll Not Found"});

    if(poll.createdBy.toString() !== req.user.id)
        return res.status(403).json({message:"Not authorized"});

    await poll.deleteOne();

    res.json({message:"Poll deleted successfully"});
}

export const getPollResults = async(req, res) => {
    const poll = await Poll.findById(req.params.id)

    if(!poll)
        return res.status(404).json({message:"Poll Not Found"});

    const results = poll.options.map(optionItem => ({
        option: optionItem.text,
        votes: optionItem.votes
    }))
    
    res.json({
        title: poll.title,
        results
    });
}

export const getPolls = async(req,res) => {
    const polls = await Poll.find();
    res.json(polls);
}

export const getPoll = async(req,res) => {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
}

export const voteForPoll = async(req,res) => {
    const userId = req.user.id;
    const pollId = req.params.id;
    const {optionIndex} = req.body;
     
    // validate poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
    }

    // validate optionIndex
    if (
        typeof optionIndex !== "number" ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
        ) {
        return res.status(400).json({ message: "Invalid option index" });
    }

    // atomic update to avoid race conditions
    const updatedPoll = await Poll.findOneAndUpdate(
        {
            _id: pollId,
            voters: { $ne: userId }  // ensure user has not voted
        },
        {
            $inc: { [`options.${optionIndex}.votes`]: 1 },
            $push: { voters: userId }
        },
        { new: true }
    );

    // prevent double voting
    if(!updatedPoll){
        return res.status(400).json({message:"Already Voted"});
    }

    res.json(updatedPoll);
}