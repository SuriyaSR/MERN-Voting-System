import Poll from "../models/Poll.js";

export const createPoll = async(req,res) => {
    const {title, options} = req.body;

    const poll = await Poll.createPoll({
        title, 
        options: options.map(option => ({text: option}))
    })
    res.json(poll);
}

export const getPolls = async(req,res) => {
    const polls = Poll.find();
    res.json(polls);
}

export const getPoll = async(res,req) => {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
}

export const voteForPoll = async(res,req) => {
    const userId = req.user.id;
    const {optionIndex} = req.body;

    const poll = await Poll.findById(req.params.id);

    if(poll.voters.include(userId)){
        return res.status(400).json({message:"Already Voted"});
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(userId);

    await poll.save();
    res.json(poll);
}