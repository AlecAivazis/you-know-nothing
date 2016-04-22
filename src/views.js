// local imports
import {Vote} from './models'
import option_source from '../options.json'


// the index view
export const index = (req, res) => {
    // a map from numbers to the word version
    const numberStrings = ['one', 'two', 'three', 'four']
    // the options to choose from
    const options = option_source['options']
    
    // add the corresponding number to each option
    for (const option of options) {
        // the index of the loop
        const index = options.indexOf(option)
        // the direction to orient
        option['orientation'] = index % 2 ? 'right' : 'left'
        // set the number attribute according to the list above
        option['number'] = numberStrings[index]
    }

    // render the index template
    res.render('index.jade', {options})
}


// the result summary
export const results = async (req, res) => {
    // connect to the database
    await Vote.sync()
    // the votes grouped by option
    const vote_counts = await Vote.count({group:'option'})
    // create a list of counts from the result
    const counts = Object.keys(vote_counts).map(key => vote_counts[key]['count'])

    // add the count to the options
    const data = option_source['options'].map((entry, index) => ({

        ...entry,
        count: counts[index] || 0
    }))

    // compute the necessary bits of data to produce the visualization
    const total = counts.reduce((prev, current) => prev + current, 0)
    const max = counts.reduce((prev, current) => current > prev ? current : prev, 0)
    console.log(data.map(({count}) => ({count})))
    // render the template with the aggregated data
    return res.render('results.jade', {data, total, max})
}


// adds a vote for the appropriate category
export const addVote = async (req, res) => {
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