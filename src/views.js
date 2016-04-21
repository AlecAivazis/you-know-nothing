// local imports
import {Vote} from './models'


// the index view
export const index = (req, res) => res.render('index.jade')


// the result summary
export const results = async function (req, res) {
    // connect to the database
    await Vote.sync()
    // the votes grouped by option
    const data = await Vote.count({group:'option'})
    // render the template with the aggregated data
    return res.render('results.jade', {data})
}


// adds a vote for the appropriate category
export const addVote = async function(req, res) {
    // the category to add a vote for
    const {option} = req.query

    try {
        // connect to the database
        await Vote.sync()
        // create a new vote corresponding to the category
        await Vote.create({option})
        // redirect to the results page
        return res.redirect('/results')

    // if something goes wrong
    } catch (err) {
        console.log("ERROR: " + err)
        // tell the user we had a problem
        return res.status(500).send(err)
    }
}