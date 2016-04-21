// local imports
import {Vote} from './models'


// the index view
export const index = (req, res) => res.render('index.jade')

// the result summary
export const results = (req, res) => res.render('results.jade')

// adds a vote for the appropriate category
export const addVote = async function(req, res) {
    // the category to add a vote for
    const {option} = req.query

    try {
        // connect to the database
        await Vote.sync({force: true})
        // create a new vote corresponding to the category
        await Vote.create({option})
        // redirect to the results page
        res.redirect('/results')

    // if something goes wrong
    } catch (err) {
        console.log("ERROR: " + err)
        // tell the user we had a problem
        res.status(500).send(err)
    }
}